import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import { parseEther, formatUnits, formatEther } from "@ethersproject/units";
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
 import { NFTAddress } from "../consts/contractAddress";
import ABI from "../consts/tokenABI.json"  ;

const useStyles = makeStyles(theme => ({
  root: {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
     height: "calc(100vh - 100px)"
  },
  inputAddress: {
    margin: "15px 0",
    width: "400px"
  },
  inputAmount: {
    width: "400px",
    marginBottom: "5px"
  },
  button: {
    width: "120px"
  },
  grid: {
    display: "grid",
    margin: '0 10px'
  },
  image: {
    width: "120px"
  }
}));

interface INFT {
  image: string,
  tokenId: number,
  upgradePrice: number
}
const MyNFTs = () => {
  const classes = useStyles();
  const { account, library } = useWeb3React();
  const [nfts, setNfts] = useState<INFT[]>([]);
  const init = async() => {
    if (!library) return;

    const tokenInstance = new Contract(NFTAddress, ABI, library.getSigner());
    const balance = await tokenInstance.balanceOf(account);
    const count = parseFloat(formatUnits(balance, 1)) * 10 ;
    const tmp = [];
    for (let i = 1; i <= count; i ++) {
      const uri = await tokenInstance.tokenURI(i);
      let price = 0;
      if (uri === 'ipfs/QmPJyzoPYgx3uAfhi48HhqX7qYvj6NaXQoDbo5x1aD9v2w/silverCrown.jpg') {
        price = 1;
      } else if (uri ==='ipfs/QmPJyzoPYgx3uAfhi48HhqX7qYvj6NaXQoDbo5x1aD9v2w/silverShield.jpeg') {
        price = 2;
      }
      tmp.push({
        image: uri,
        tokenId: i,
        upgradePrice: price
      });
    }
    console.log(tmp)
    setNfts(tmp);
  }

  useEffect(() => {
    init();
  },[account])

  const onUpdate = async(nft: INFT) => {
    if (!nft.tokenId) {
      alert("You should mint first");
      return;
    }
    if (nft.upgradePrice ===0) {
      alert("already upgraded");
      return;
    }

    const tokenInstance = new Contract(NFTAddress, ABI, library.getSigner());
    const ethBalance = await library.getBalance(account);
    if (parseFloat(formatEther(ethBalance)) < nft.upgradePrice) {
      alert("Not insufficient balance");
      return;
    }
    try {
      const response = await tokenInstance.updateTokenURI(nft.tokenId, nft.image.replace("silver", "gold"), {value: parseEther(nft.upgradePrice.toString())});
      await response.wait();
      console.log({response})
      alert("Successfully upgraded");
      await init();
    } catch(err) {
      alert("Something went wrong");
    }
    
  }

  return (
    <div className={classes.root}>
         {
          nfts.map((nft: INFT) => {
            return (
              <div key={nft.tokenId} className={classes.grid}>
                <img src={`https://ipfs.io/${nft.image}`} alt='silverIamge' className={classes.image}/>
                <span>Upgradable Price: {nft.upgradePrice} Eth </span>
                <Button disabled={!account} variant="contained" color="primary" className={classes.button} onClick={ () => onUpdate(nft)} >
                 Upgrade
                </Button>  
              </div>

            )
          })
        }
       
     </div>
  )
}

export default MyNFTs;
