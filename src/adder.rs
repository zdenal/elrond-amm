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
        let caller = self.blockchain().get_caller();

        self.fee().set(fee);
        self.shares().insert(caller.clone(), BigUint::zero());
        self.token1_accounts().insert(caller.clone(), BigUint::zero());
        self.token2_accounts().insert(caller.clone(), BigUint::zero());

        let detail = PoolDetail {
            token1_total: BigUint::zero(),
            token2_total: BigUint::zero(),
            shares_total: BigUint::zero(),
            fee: self.fee().get()
        };

        self.pool_detail().set(detail);
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
    fn get_my_holdings(&self) -> (BigUint, BigUint, BigUint) {
        let caller = self.blockchain().get_caller();

        let token1_amount = self.token1_accounts().get(&caller).unwrap_or(BigUint::zero());
        let token2_amount = self.token2_accounts().get(&caller).unwrap_or(BigUint::zero());
        let shares_amount = self.shares().get(&caller).unwrap_or(BigUint::zero());

        (token1_amount, token2_amount, shares_amount)
    }

    #[endpoint]
    fn provide(&self, token1_amount: BigUint, token2_amount: BigUint) -> BigUint {
        // TODO: check available amount for tokens
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

        let caller = self.blockchain().get_caller();

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
        sc_print!("share is {}", share);

        let updated_detail = PoolDetail {
            token1_total: &token1_total + &token1_amount,
            token2_total: &token2_total + &token2_amount,
            shares_total: &shares_total + &share,
            ..detail
        };

        self.pool_detail().set(updated_detail);

        share
    }

    #[view(getWithdrawEstimate)]
    fn get_withdraw_estimate(&self, share: BigUint) -> (BigUint, BigUint) {
        let detail = self.pool_detail().get();
        require!(detail.shares_total >= share, "Share should be less than total share");

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

        self.token1_accounts().entry(caller.clone()).and_modify(|value| *value += &token1_amount);
        self.token2_accounts().entry(caller.clone()).and_modify(|value| *value += &token2_amount);
        self.shares().entry(caller.clone()).and_modify(|value| *value -= &share);

        let updated_detail = PoolDetail {
            token1_total: &detail.token1_total - &token1_amount,
            token2_total: &detail.token2_total - &token2_amount,
            shares_total: &detail.shares_total - &share,
            ..detail
        };

        self.pool_detail().set(updated_detail);

        (token1_amount, token2_amount)
    }
}
