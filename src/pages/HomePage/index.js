import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { ethers, Contract } from 'ethers';
import MHidden from '../../components/@mui-extend/MHidden';
import DesktopHeroSection from './heroSections/DesktopHeroSection';
import IPadHeroSection from './heroSections/IPadHeroSection';
import IPhoneHeroSection from './heroSections/IPhoneHeroSection';
import useWallet from '../../hooks/useWallet';
import { ABI, CONTRACT_ADDRESS, NFT_PRICE } from '../../constants';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

export default function HomePage() {
	const { mintAmount } = useWallet();

	const [isOpened, setIsOpened] = useState(false);
	const [severity, setSeverity] = useState('success');
	const [message, setMessage] = useState('');
	const [contractAddress, setContractAddress] = useState(undefined);
	const [isConnected, setIsConnected] = useState(false);

	const openAlert = (severity, message) => {
		setSeverity(severity);
		setMessage(message);
		setIsOpened(true);
	};

	const getWeb3Modal = async () => {
		const web3Modal = new Web3Modal({
			network: 'mainnet',
			cacheProvider: false,
			providerOptions: {
				walletconnect: {
					package: WalletConnectProvider,
					options: {
						// infuraId: '8cf3cad623da43f9a84ab5ac94230cf6'
						infuraId: '716d0574cc4c423a9adc0f4e451076ee',
					},
				},
			},
		});
		return web3Modal;
	};
	// console.log('web3modal deets' + getWeb3Modal);
	// console.log('signer deets' + getWeb3Modal.signer);

	useEffect(() => {
		const init = async () => {
			const web3Modal = await getWeb3Modal();
			const connection = await web3Modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			let contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
			setContractAddress(contract);
			setIsConnected(true);
		};
		init();
	}, []);

	// const minter = async () => {
	// 	try {

	// const connection = connectionWallet;
	// const provider = new ethers.providers.Web3Provider(connection);

	// const signer = provider.getSigner();
	// const contract =
	// 	} catch (error) {
	// 		openAlert(
	// 			'error',
	// 			error.message ? error.message : 'Transaction is failed.'
	// 		);
	// 	}
	// };

	const mint = async () => {
		try {
			if (isConnected === true) {
				// console.log('chain id: ' + chainId);
				// const chainId = await ethereum.request({ method: 'eth_chainId' });
				// if (chainId === 1) {
				// const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
				// alert('const: contract passed');

				let transaction = await contractAddress.mint(mintAmount, {
					value: ethers.utils.parseEther(String(NFT_PRICE * mintAmount)),
				});

				alert('const: transaction passed');
				// alert(contract);
				// console.log('mobile triggered');
				await transaction.wait();
				alert('const: await passed');
				openAlert('success', 'Minted!');
				alert('const: we should not get this far');
				// } else {
				// 	openAlert('warning', 'Please choose Ethereum mainnet.');
				// }
			} else {
				openAlert('error', "Ethereum object doesn't exist");
			}
		} catch (error) {
			openAlert(
				'error',
				error.message ? error.message : 'Transaction is failed.'
			);
			alert('failed, it might start the loop over from here?');
		}
	};

	return (
		<Box height='100vh'>
			<MHidden width='mdDown'>
				<DesktopHeroSection mint={mint} />
			</MHidden>

			<MHidden width='mdUp'>
				<MHidden width='smDown'>
					<IPadHeroSection mint={mint} />
				</MHidden>
				<MHidden width='smUp'>
					<IPhoneHeroSection mint={mint} />
				</MHidden>
			</MHidden>

			<Snackbar
				open={isOpened}
				autoHideDuration={5000}
				onClose={() => setIsOpened(false)}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert
					variant='filled'
					onClose={() => setIsOpened(false)}
					severity={severity}
					sx={{ width: '100%' }}
				>
					{message}
				</Alert>
			</Snackbar>
		</Box>
	);
}
