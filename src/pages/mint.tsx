import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import { parseEther } from "@ethersproject/units";
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

const nfts = [
  {
    silverImage: 'ipfs/QmPJyzoPYgx3uAfhi48HhqX7qYvj6NaXQoDbo5x1aD9v2w/silverCrown.jpg',
    upgradePrice: 1
  },
  {
    silverImage: 'ipfs/QmPJyzoPYgx3uAfhi48HhqX7qYvj6NaXQoDbo5x1aD9v2w/silverShield.jpeg',
    upgradePrice: 2
  },

]
const Mint = () => {
  const classes = useStyles();
  const { account, library } = useWeb3React();


  const onMint = async (nft: any) => {
    const tokenInstance = new Contract(NFTAddress, ABI, library.getSigner());
    try {
      await tokenInstance.mintNFT(nft.silverImage, nft.upgradePrice);
      alert("Successfully minted");
    } catch(err) {
      alert("Something went wrong");
    }
  }

  return (
    <div className={classes.root}>
         {
          nfts.map(nft => {
            return (
              <div key={nft.silverImage} className={classes.grid}>
                <img src={`https://ipfs.io/${nft.silverImage}`} alt='silverIamge' className={classes.image}/>
                <br />
                <Button disabled={!account} variant="contained" color="primary" className={classes.button} onClick={ () => onMint(nft)} >
                 Mint
                </Button>
              </div>

            )
          })
        }
       
     </div>
  )
}

export default Mint;
