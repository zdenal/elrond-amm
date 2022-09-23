#![no_std]

elrond_wasm::imports!();
elrond_wasm::derive_imports!();

#[derive(TopEncode, TopDecode, TypeAbi)]
pub struct PoolDetail<M: ManagedTypeApi> {
    pub token1_total: BigUint<M>,
    pub token2_total: BigUint<M>,
    pub shares_total: BigUint<M>,
    pub fee: BigUint<M>,
}

#[derive(TopEncode, TopDecode, TypeAbi)]
pub struct Holding<M: ManagedTypeApi> {
    pub token1_amount: BigUint<M>,
    pub token2_amount: BigUint<M>,
    pub shares_amount: BigUint<M>,
}

const PRECISION: usize = 1_000_000; // Precision of 6 digits

#[elrond_wasm::contract]
pub trait Adder {
    #[storage_mapper("fee")]
    fn fee(&self) -> SingleValueMapper<BigUint>;

    //#[storage_mapper("token1_total")]
    //fn token1_total(&self) -> SingleValueMapper<BigUint>;

    #[storage_mapper("token1_accounts")]
    fn token1_accounts(&self) -> MapMapper<ManagedAddress, BigUint>;

    //#[storage_mapper("token2_total")]
    //fn token2_total(&self) -> SingleValueMapper<BigUint>;

    #[storage_mapper("token2_accounts")]
    fn token2_accounts(&self) -> MapMapper<ManagedAddress, BigUint>;

    #[storage_mapper("shares_total")]
    fn shares_total(&self) -> SingleValueMapper<BigUint>;

    #[storage_mapper("shares")]
    fn shares(&self) -> MapMapper<ManagedAddress, BigUint>;

    #[view(getPoolDetail)]
    #[storage_mapper("pool_detail")]
    fn pool_detail(&self) -> SingleValueMapper<PoolDetail<Self::Api>>;

    #[init]
    fn init(&self, fee: BigUint) {
        self.fee().set(fee);

        let detail = PoolDetail {
            token1_total: BigUint::zero(),
            token2_total: BigUint::zero(),
            shares_total: BigUint::zero(),
            fee: self.fee().get(),
        };

        self.pool_detail().set_if_empty(detail);
    }

    #[endpoint]
    fn faucet(&self, token1_amount: BigUint, token2_amount: BigUint) {
        let caller = self.blockchain().get_caller();

        self.token1_accounts()
            .entry(caller.clone())
            .and_modify(|value| *value += &token1_amount)
            .or_insert(token1_amount);
        self.token2_accounts()
            .entry(caller)
            .and_modify(|value| *value += &token2_amount)
            .or_insert(token2_amount);
    }

    #[view(getMyHoldings)]
    fn get_my_holdings(&self) -> Holding<Self::Api> {
        let caller = self.blockchain().get_caller();

        let token1_amount = self
            .token1_accounts()
            .get(&caller)
            .unwrap_or(BigUint::zero());
        let token2_amount = self
            .token2_accounts()
            .get(&caller)
            .unwrap_or(BigUint::zero());
        let shares_amount = self.shares().get(&caller).unwrap_or(BigUint::zero());

        Holding {
            token1_amount,
            token2_amount,
            shares_amount,
        }
    }

    #[view(getToken1ProvideEstimate)]
    fn get_token1_provide_estimate(&self, token2_amount: BigUint) -> BigUint {
        let pool_detail = self.pool_detail().get();
        require!(
            &pool_detail.token1_total * &pool_detail.token2_total > 0,
            "Zero liquidity in pool"
        );

        pool_detail.token1_total * token2_amount / pool_detail.token2_total
    }

    #[view(getToken2ProvideEstimate)]
    fn get_token2_provide_estimate(&self, token1_amount: BigUint) -> BigUint {
        let pool_detail = self.pool_detail().get();
        require!(
            &pool_detail.token1_total * &pool_detail.token2_total > 0,
            "Zero liquidity in pool"
        );

        pool_detail.token2_total * token1_amount / pool_detail.token1_total
    }

    #[endpoint]
    fn provide(&self, token1_amount: BigUint, token2_amount: BigUint) -> BigUint {
        let caller = self.blockchain().get_caller();
        let holdings = self.get_my_holdings();

        require!(
            holdings.token1_amount >= token1_amount,
            "Insufficient Token1 amount"
        );
        require!(
            holdings.token2_amount >= token2_amount,
            "Insufficient Token2 amount"
        );

        let detail = self.pool_detail().get();
        let shares_total = detail.shares_total;
        let token1_total = detail.token1_total;
        let token2_total = detail.token2_total;

        let share = if shares_total == 0 {
            BigUint::from(100 * PRECISION)
        } else {
            let share1 = &shares_total * &token1_amount / &token1_total;
            let share2 = &shares_total * &token2_amount / &token2_total;

            require!(share1 == share2, "Non equivalent value");
            share1
        };

        require!(share != 0, "Threshold not reached");

        self.token1_accounts()
            .entry(caller.clone())
            .and_modify(|value| *value -= &token1_amount);

        self.token2_accounts()
            .entry(caller.clone())
            .and_modify(|value| *value -= &token2_amount);

        self.shares()
            .entry(caller)
            .and_modify(|value| *value += &share)
            .or_insert(share.clone());

        require!(share != 0, "Threshold not reached");

        let updated_detail = PoolDetail {
            token1_total: &token1_total + &token1_amount,
            token2_total: &token2_total + &token2_amount,
            shares_total: &shares_total + &share,
            ..detail
        };

        self.pool_detail().set(updated_detail);

        share
    }

    #[view(getSwapToken1Estimate)]
    fn get_swap_token1_estimate(&self, token1_amount: BigUint) -> (BigUint, BigUint) {
        let pool_detail = self.pool_detail().get();

        self.swap_token1_estimate(&pool_detail, &token1_amount)
    }

    #[view(getSwapToken2Estimate)]
    fn get_swap_token2_estimate(&self, token2_amount: BigUint) -> (BigUint, BigUint) {
        let pool_detail = self.pool_detail().get();

        self.swap_token2_estimate(&pool_detail, &token2_amount)
    }

    #[endpoint(swapToken1)]
    fn swap_token1(
        &self,
        token1_amount: BigUint,
        min_token2_amount: BigUint,
    ) -> (BigUint, BigUint) {
        let caller = self.blockchain().get_caller();
        let holdings = self.get_my_holdings();
        let pool_detail = self.pool_detail().get();

        require!(
            &holdings.token1_amount >= &token1_amount,
            "Insufficient Token1 amount"
        );

        let (token2_amount, fee_amount) = self.swap_token1_estimate(&pool_detail, &token1_amount);

        require!(&token2_amount > &min_token2_amount, "Slippage exceed");

        self.token1_accounts()
            .entry(caller.clone())
            .and_modify(|value| *value -= &token1_amount);

        self.token2_accounts()
            .entry(caller.clone())
            .and_modify(|value| *value += &token2_amount);

        let updated_pool_detail = PoolDetail {
            token1_total: &pool_detail.token1_total + &token1_amount,
            token2_total: &pool_detail.token2_total - &token2_amount,
            ..pool_detail
        };

        self.pool_detail().set(updated_pool_detail);
        (token2_amount, fee_amount)
    }

    #[endpoint(swapToken2)]
    fn swap_token2(
        &self,
        token2_amount: BigUint,
        min_token1_amount: BigUint,
    ) -> (BigUint, BigUint) {
        let caller = self.blockchain().get_caller();
        let holdings = self.get_my_holdings();
        let pool_detail = self.pool_detail().get();

        require!(
            &holdings.token2_amount >= &token2_amount,
            "Insufficient Token2 amount"
        );

        let (token1_amount, fee_amount) = self.swap_token2_estimate(&pool_detail, &token2_amount);

        require!(&token1_amount > &min_token1_amount, "Slippage exceed");

        self.token1_accounts()
            .entry(caller.clone())
            .and_modify(|value| *value += &token1_amount);

        self.token2_accounts()
            .entry(caller.clone())
            .and_modify(|value| *value -= &token2_amount);

        let updated_pool_detail = PoolDetail {
            token1_total: &pool_detail.token1_total - &token1_amount,
            token2_total: &pool_detail.token2_total + &token2_amount,
            ..pool_detail
        };

        self.pool_detail().set(updated_pool_detail);
        (token1_amount, fee_amount)
    }

    #[view(getWithdrawEstimate)]
    fn get_withdraw_estimate(&self, share: BigUint) -> (BigUint, BigUint) {
        let detail = self.pool_detail().get();
        require!(
            detail.shares_total >= share,
            "Share should be less than total share"
        );

        let token1_amount = &share * &detail.token1_total / &detail.shares_total;
        let token2_amount = share * detail.token2_total / detail.shares_total;
        (token1_amount, token2_amount)
    }

    #[endpoint]
    fn withdraw(&self, share: BigUint) -> (BigUint, BigUint) {
        let caller = self.blockchain().get_caller();
        let shares_amount = self.shares().get(&caller).unwrap_or(BigUint::zero());

        require!(&share <= &shares_amount, "Insufficient amount");

        let (token1_amount, token2_amount) = self.get_withdraw_estimate(share.clone());
        let detail = self.pool_detail().get();

        self.token1_accounts()
            .entry(caller.clone())
            .and_modify(|value| *value += &token1_amount);
        self.token2_accounts()
            .entry(caller.clone())
            .and_modify(|value| *value += &token2_amount);
        self.shares()
            .entry(caller.clone())
            .and_modify(|value| *value -= &share);

        let updated_detail = PoolDetail {
            token1_total: &detail.token1_total - &token1_amount,
            token2_total: &detail.token2_total - &token2_amount,
            shares_total: &detail.shares_total - &share,
            ..detail
        };

        self.pool_detail().set(updated_detail);

        (token1_amount, token2_amount)
    }

    fn swap_token1_estimate(
        &self,
        pool_detail: &PoolDetail<Self::Api>,
        token1_amount: &BigUint,
    ) -> (BigUint, BigUint) {
        require!(
            &pool_detail.token1_total >= token1_amount,
            "Insufficient liquidity"
        );

        let token1_amount_w_fee =
            (&BigUint::from(1000u16) - &pool_detail.fee) * token1_amount / &BigUint::from(1000u16); // Adjusting the fees charged
                                                                                                    //
        let k = &pool_detail.token1_total * &pool_detail.token2_total;
        let token1_total_after = &pool_detail.token1_total + &token1_amount_w_fee;
        let token2_total_after = k / &token1_total_after;
        let estimated_amount = &pool_detail.token2_total - &token2_total_after;
        let fee_amount = token1_amount - &token1_amount_w_fee;
        (estimated_amount, fee_amount)
    }

    fn swap_token2_estimate(
        &self,
        pool_detail: &PoolDetail<Self::Api>,
        token2_amount: &BigUint,
    ) -> (BigUint, BigUint) {
        require!(
            &pool_detail.token2_total >= token2_amount,
            "Insufficient liquidity"
        );

        //
        let k = &pool_detail.token1_total * &pool_detail.token2_total;
        let token2_total_after = &pool_detail.token2_total + token2_amount;
        let token1_total_after = k / &token2_total_after;
        let token1_amount = &pool_detail.token1_total - &token1_total_after;

        // token1 amount w/ fee
        let estimated_amount =
            (&BigUint::from(1000u16) - &pool_detail.fee) * &token1_amount / &BigUint::from(1000u16);
        let fee_amount = token1_amount - &estimated_amount;
        (estimated_amount, fee_amount)
    }
}
