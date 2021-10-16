import React ,{useState,useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {Button} from '@mui/material';
import {ExcelRenderer} from 'react-excel-renderer';
import {DropzoneArea} from 'material-ui-dropzone';
import {fetchData} from "../Redux/action/pcrstocks.action"
import firebase from '../firebase'
import {
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#3f51b5',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
 function UploadPcr() {
  // const pcrResponse = useSelector(state => state)
  const dispatch = useDispatch();
  const [cols,setcols] = useState([])
  const [rows,setrows] = useState([])
  const [excelDataState,setexcelDataState] = useState([])
  const [headerArr,setheaderArr] = useState([])

  useEffect(() => {
    const messaging = firebase.messaging()
    messaging.requestPermission().then(()=>{
      return messaging.getToken()
    }).then(token=>{
      console.log('Token : ',token)
    }).catch((err)=>{
      console.log("hello",err);
     })
    return () => {
      
    }
  }, [])

  useEffect(() => {
    console.log(rows)
    var excelObj = {}
    var exceldata = []
    if(rows.length>0){
      for(var i=1;i<rows.length-1;i++){
        for(var j=0;j<rows[0].length;j++){
          excelObj[rows[0][j]] = rows[i][j]
        }
        exceldata.push(excelObj)
        excelObj = {}
      }
     
    }

    // console.log(exceldata)
    setexcelDataState(exceldata)
    return () => {
      
    }
  }, [rows])

  useEffect(() => {
    console.log(excelDataState)
    if(excelDataState.length>0){
      console.log(Object.keys(excelDataState[0]))
      setheaderArr(Object.keys(excelDataState[0]))
    }
    
    return () => {
      
    }
  }, [excelDataState])

  const fileHandler = (event) => {
    // console.log(event)
    let fileObj = event[0];

    //just pass the fileObj as parameter
    if(fileObj){
      ExcelRenderer(fileObj, (err, resp) => {
        if(err){
          console.log(err);            
        }
        else{
          setcols(resp.cols)
          setrows(resp.rows)
        }
      });      
    }
  }

  const submitData = () =>{
    var sendObj = {}
    sendObj["data"] = excelDataState;
    sendObj["action"] = "insert";
    sendObj["url"] = "insert";
    console.log(sendObj)
    dispatch(fetchData(sendObj))
  }

  return (
    <Grid direction="column" container spacing={2} style={{"marginTop":"20px"}}>
      <Grid direction="row" container spacing={2}>
        <Grid item xs={1}>
        </Grid>
        <Grid item xs={9}>
          <DropzoneArea  onChange={(file)=>fileHandler(file)} style={{"padding":"10px"}} />
        </Grid>
        <Grid item xs={2} style={{"marginTop":"211px"}} >
        {headerArr.length>0 &&
            <Grid direction="row"  container spacing={0}>
              <Grid item xs={4}>
              <Button onClick = {()=>submitData()} variant="contained">Submit</Button>
              </Grid>
              <Grid item xs={4}>
                <Button variant="outlined">Cancel</Button>
              </Grid>
              <Grid item xs={2}>
              </Grid>
            </Grid>
          }
        </Grid>
      </Grid>
    <Grid direction="row" container spacing={2} style={{"marginTop":"20px"}}>
      <Grid item xs={1}>
      </Grid>
      <Grid item xs={10} className="tablecontainer">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
              {headerArr.map((rowdata) => (
                <StyledTableCell>{rowdata}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {excelDataState.map((row) => (
                <StyledTableRow key={row.name}>
                  {headerArr.map((rowdata) => (
                    <StyledTableCell>{row[rowdata]}</StyledTableCell>
                    ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={1}>
        
      </Grid>
    </Grid>
    </Grid>
    
    
  )
}

export default UploadPcr
