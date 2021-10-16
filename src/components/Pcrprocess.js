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
  Table,
  TextField 
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import CircularProgress from '@mui/material/CircularProgress';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
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
 function UploadPcr(props) {
  const pcrResponse = useSelector(state => state)
  const dispatch = useDispatch();
  const [cols,setcols] = useState([])
  const [rows,setrows] = useState([])
  const [excelDataState,setexcelDataState] = useState([])
  const [headerArr,setheaderArr] = useState([])
  const [sliceData,setsliceData] = useState([])
  let datevaluestring = new Date()
  const [datevalue , setdatevalue] = useState(datevaluestring)

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
    console.log(pcrResponse.pcrstockReducer.loader)
    var excelObj = {}
    var exceldata = []
    if(rows.length>0){
      for(var i=1;i<rows.length-1;i++){
        for(var j=0;j<rows[0].length;j++){
          if(rows[0][j]==="CONTRACT_D"){
            rows[i][j] = rows[i][j].replace("OPTSTK","").replace(/[0-9]/g,"").replace("OPTIDX","").replace(".","")
            excelObj[rows[0][j]] = rows[i][j]
          }
          if(rows[0][j]==="OI_NO_CON"){
            excelObj[rows[0][j]] = rows[i][j]
          }
          
        }
        exceldata.push(excelObj)
        excelObj = {}
      }
     
    }
    console.log(exceldata[0]);
    // console.log(exceldata)
    setexcelDataState(exceldata)
    return () => {
      
    }
  }, [rows])

  
  useEffect(() => {
    if(excelDataState.length>0){
      setsliceData(excelDataState.slice(1, 100))
      setheaderArr(Object.keys(excelDataState[0]))
    }
    
    return () => {
      
    }
  }, [excelDataState])

  const fileHandler = (event) => {
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
      let dateObj = new Date(datevalue)
    let month = dateObj.getMonth() + 1;
    let monthNUm = dateObj.getMonth()
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();
    let datelocal = year +"-" + month +"-" +day;
    console.log(datelocal)
    var sendObj = {}
    sendObj["data"] = excelDataState;
    sendObj["action"] = "bhavinsert";
    sendObj["url"] = "bhavinsert";
    sendObj["date"] = datelocal;
    console.log("132",sendObj)
    setheaderArr([])
    props.history.push("/showpcr")
    dispatch(fetchData(sendObj))
  }

  const handleChange = (newvalue) =>{
    let dateObj = new Date(newvalue)
    let month = dateObj.getMonth() + 1;
    let monthNUm = dateObj.getMonth()
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();
    let datelocal = year +"-" + month +"-" +day;
    console.log(datelocal)

    setdatevalue(datelocal)
  }

  return (
    <>
    {pcrResponse.pcrstockReducer.loader ==1 && <div className = "loader">
      <CircularProgress color="secondary" />
    </div>}
    {pcrResponse.pcrstockReducer.loader ==1 && <div className = "overlay"></div>}
    <Grid direction="column" container spacing={2} style={{"marginTop":"20px"}}>
      <Grid direction="row" container spacing={2}>
        <Grid item xs={1}>
        </Grid>
        <Grid item xs={9}>
          <Grid direction="row" container spacing={2}>
            <Grid item xs={8}>
              <h1>PCR PROCESS</h1>
            </Grid>
            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns} >
                <DesktopDatePicker
                  label="Date desktop"
                  inputFormat="MM/dd/yyyy"
                  value={datevalue}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        
          <DropzoneArea  onChange={(file)=>fileHandler(file)} style={{"padding":"10px"}} acceptedFiles={[".csv, text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values"] } maxFileSize = {50000000} />
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
              {sliceData.map((row) => (
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
   </> 
    
  )
}

export default UploadPcr
