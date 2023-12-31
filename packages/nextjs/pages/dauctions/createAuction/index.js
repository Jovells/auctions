import React, { useRef, useState } from "react";
import { Box, Button, Input, MenuItem, Select, TextField, TextareaAutosize, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import storeNFT from "../../../utils/time/ipfs";
import Time from "../../../utils/time"
import {useScaffoldContractWrite} from "../../../hooks/scaffold-eth/useScaffoldContractWrite";
import { CONTRACT_ADDRESS, NFT_ADDRESS } from "../../../utils/constants";

const stablecoins = [
    { name: 'USDC', address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' },
    { name: 'USDT', address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f' },
    { name: 'DAI', address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063' },
  ];

const ImageUploader = () => {
  const [image, setFile] = useState(null);
  const fileInputRef = useRef(null);


  const nft  = useScaffoldContractWrite({
    contractName: "DauctionNft",
    functionName: "mint",
    // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
    blockConfirmations: 1,
    // The callback function to execute when the transaction is confirmed.
    onBlockConfirmation: (txnReceipt) => {console.log(txnReceipt); txnReceipt},
  });

  const auction = useScaffoldContractWrite({
    contractName: "Auction",
    functionName: "createAuction",
    // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
    blockConfirmations: 1,
    // The callback function to execute when the transaction is confirmed.
    onBlockConfirmation: (txnReceipt) => {console.log(txnReceipt); txnReceipt},
  });

  
  const { data: yourContract } = useScaffoldContractWrite({
    contractName: "Auction",
  });

  console.log(yourContract)



  


  async function handlemint(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = Object.fromEntries(form.entries());
    data.startingPrice = parseFloat(data.startingPrice * 10 ** 6);
    data.startTime = Time.getTimestampInSeconds(data.startTime);
    data.endTime = Time.getTimestampInSeconds(data.endTime);
    // const metadata = await storeNFT(image, data);
   await nft.writeAsync({args:[auction.variables.address, "ipfs://bafyreibpisxby6xsthd2grxvhhixheyab4eger2gqx7a6v7asi6mbezn5m/metadata.json"],
    onBlockConfirmation: (txnReceipt) => {console.log(txnReceipt)},

  });

    // const  auction = await auction.writeAsync({args:[data.currency, data.startTime, data.endTime, data.startingPrice, txnReceipt.events.Transfer.returnValues.tokenId, nft.variables.address]})
    console.log(data, metadata,  );
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDeleteImage = () => {
    setFile(null);
  };

  return (
    <Grid direction={'column'} component={'form'} onSubmit={handlemint} ml={5} mt={5} container maxWidth={'772px'}>
        <Typography variant="h2" >Create Auction</Typography>
        <Typography variant='subtitle1' fontWeight={'bold'}>Image</Typography>
        <Box     sx={{
          width: '100%',
          height: '300px',
            borderRadius: '10px',
            border: '1px solid grey',
          backgroundImage: image ? `url(${URL.createObjectURL(image)})` : '',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick = {() => fileInputRef.current.click()}
      >
               {!image && (
          <InsertPhotoIcon sx={{ fontSize: 30, color: 'grey.500' }} />
        )}
      </Box>
      <input    type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}  
        />
        <TextField name="name" label='Name of Asset' sx={{mt:3, mb:2}}  placeholder="Enter Name" fullWidth />
        <TextField name="description" label = 'Description' sx={{mb:2, }} placeholder="Provide a detailed description of your item"></TextField>
        <TextField name="externalLink" label = 'External Link' sx={{mb:2, }} placeholder="A link to this URL will be included on this item's detail page, for users to learn more about it"></TextField>
        <TextField name="startTime" InputLabelProps={{ shrink: true }}  type="dateTime-local" sx={{mb:2, }} label='Start Time'  placeholder="Select A time" fullWidth />
        <TextField name="endTime" InputLabelProps={{ shrink: true }}  type="dateTime-local" sx={{mb:2, }} label='End Time' placeholder="Select A time" fullWidth />
        <TextField name="currency" defaultValue={''} select label="Currency" sx={{mb:2, }} fullWidth>
        {stablecoins.map((coin) => (
          <MenuItem key={coin.address} value={coin.address}>
            {coin.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField name="startingPrice" label='Starting Price' sx={{mb:2, }}  placeholder="Enter Starting Price" fullWidth />
      <Button type="submit" variant="contained">Create</Button>
        
    </Grid>
  );
};

export default ImageUploader;