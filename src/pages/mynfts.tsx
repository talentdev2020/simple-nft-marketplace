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
    width: "40px",
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
    width: "120px",
    height: "120px"
  }
}));

interface INFT {
  image: string,
  tokenId: number,
}
const MyNFTs = () => {
  const classes = useStyles();
  const { account, library } = useWeb3React();
  const [nfts, setNfts] = useState<INFT[]>([]);
  const [prices, setPrices] = useState<number[]>([]);

  const init = async() => {
    if (!library) return;

    const tokenInstance = new Contract(NFTAddress, ABI, library.getSigner());
    const balance = await tokenInstance.balanceOf(account);
    const count = parseFloat(formatUnits(balance, 1)) * 10 ;
    const tmp = [];
    for (let i = 1; i <= count; i ++) {
      const uri = await tokenInstance.tokenURI(i);
      
      tmp.push({
        image: uri,
        tokenId: i,
      });
    }

    setNfts(tmp);
  }

  useEffect(() => {
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[account])

  const onUpdate = async(nft: INFT) => {
    if (!nft.tokenId) {
      alert("You should mint first");
      return;
    }

    const tokenInstance = new Contract(NFTAddress, ABI, library.getSigner());
    const ethBalance = await library.getBalance(account);
    if (parseFloat(formatEther(ethBalance)) < prices[nft.tokenId]) {
      alert("Not insufficient balance");
      return;
    }
    try {
      const response = await tokenInstance.updateTokenURI(nft.tokenId, nft.image.replace("silver", "gold"), {value: parseEther(prices[nft.tokenId].toString())});
      await response.wait();

      alert("Successfully upgraded");
      await init();
    } catch(err) {
      alert("Something went wrong");
    }
    
  }

  const onChangeValue = (e: any, tokenId: number) => {
    const value = e.target.value;
    prices[tokenId] = value;
    setPrices(prices.slice());
  }

  return (
    <div className={classes.root}>
         {
          nfts.map((nft: INFT) => {
            return (
              <div key={nft.tokenId} className={classes.grid}>
                <img src={`https://ipfs.io/${nft.image}`} alt='silverIamge' className={classes.image}/>
                <br />
                <div>
                  <input type="text" onChange={(e) => onChangeValue(e, nft.tokenId)} className={classes.inputAmount} /> <span>Eth</span>
                </div>
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
