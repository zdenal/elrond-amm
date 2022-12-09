import logging
from argparse import ArgumentParser
from pathlib import Path

from erdpy import config
from erdpy.accounts import Account, Address
from erdpy.contracts import CodeMetadata, SmartContract
from erdpy.projects import ProjectRust
from erdpy.proxy import ElrondProxy
from erdpy import utils

logger = logging.getLogger("examples")

if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument("--proxy", help="Proxy URL", default=config.get_proxy())
    parser.add_argument("--contract", help="Existing contract address")
    parser.add_argument("--pem", help="PEM file", required=True)
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO)

    proxy = ElrondProxy(args.proxy)
    network = proxy.get_network_config()
    chain = network.chain_id
    gas_price = network.min_gas_price
    tx_version = network.min_tx_version

    user = Account(pem_file=args.pem)

    project = ProjectRust(Path(__file__).parent.parent)
    bytecode = project.get_bytecode()

    # We initialize the smart contract with an actual address if IF was previously deployed,
    # so that we can start to interact with it ("query_flow")
    contract = SmartContract(address=args.contract)

    def deploy_flow():
        global contract

        # For deploy, we initialize the smart contract with the compiled bytecode
        contract = SmartContract(bytecode=bytecode)

        tx = contract.deploy(
            owner=user,
            arguments=["0x0005"],
            gas_price=gas_price,
            gas_limit=600000000,
            value=0,
            chain=chain,
            version=tx_version
        )

        tx_on_network = tx.send_wait_result(proxy, 5000)

        logger.info("Tx hash: %s", tx_on_network.get_hash())
        logger.info("Contract address: %s", contract.address.bech32())

    def do_upgrade():
        contract_address = Address(input("Contract address: "))
        bytecode_path = Path(input("Path to WASM: ")).absolute()
        bytecode = utils.read_binary_file(bytecode_path).hex()
        code_metadata = CodeMetadata(upgradeable=True)
        contract = SmartContract(address=contract_address, bytecode=bytecode, metadata=code_metadata)

        user.sync_nonce(proxy)

        tx = contract.upgrade(
            owner=user,
            arguments=["0x0005"],
            gas_price=network.min_gas_price,
            gas_limit=600000000,
            value=0,
            chain=network.chain_id,
            version=network.min_tx_version
        )

        tx_on_network = tx.send_wait_result(proxy, 5000)

        logger.info(f"Upgrade transaction: {tx_on_network.get_hash()}")

    def get_pool_detail_flow():
        answer = contract.query(proxy, "getPoolDetail", [])
        logger.info(f"Answer: {answer}")

    def add_flow(number):
        tx = contract.execute(
            caller=user,
            function="add",
            arguments=[number],
            gas_price=gas_price,
            gas_limit=50000000,
            value=0,
            chain=chain,
            version=tx_version
        )

        tx_hash = tx.send(proxy)
        logger.info("Tx hash: %s", tx_hash)

    user.sync_nonce(ElrondProxy(args.proxy))

    def set_fee(hex_number):
        tx = contract.execute(
            caller=user,
            function="set_fee",
            arguments=[hex_number],
            gas_price=gas_price,
            gas_limit=50000000,
            value=0,
            chain=chain,
            version=tx_version
        )

        tx_hash = tx.send(proxy)
        logger.info("Tx hash: %s", tx_hash)

    user.sync_nonce(ElrondProxy(args.proxy))

    while True:
        print("Let's run a flow.")
        print("1. Deploy")
        print("2. Query getPoolDetail()")
        print("3. Add()")
        print("4. Upgrade")
        print("5. Set fee()")

        try:
            choice = int(input("Choose:\n"))
        except Exception:
            break

        if choice == 1:
            deploy_flow()
            user.nonce += 1
        elif choice == 2:
            get_pool_detail_flow()
        elif choice == 3:
            number = int(input("Enter number:"))
            add_flow(number)
            user.nonce += 1
        elif choice == 4:
            do_upgrade()
            user.nonce += 1
        elif choice == 5:
            hex_number = input("Enter hex number:")
            set_fee(hex_number)
            user.nonce += 1
