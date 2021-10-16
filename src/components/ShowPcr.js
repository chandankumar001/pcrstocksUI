import React,{useEffect,useState} from 'react'
import { useDispatch,useSelector } from 'react-redux';
import {fetchData} from "../Redux/action/pcrstocks.action";
import { LineChart, Line, CartesianGrid, XAxis, YAxis,Tooltip,BarChart ,Label,Bar,LabelList } from 'recharts';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  Select ,
  MenuItem ,
  InputLabel ,
  FormControl,
  Box,
  Button
} from '@mui/material';
import TextField from '@mui/material/TextField';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import CircularProgress from '@mui/material/CircularProgress';
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

 function ShowPcr() {
  const [data, setdata] = useState([{name: 'Page A', uv: 400, pv: 2400, amt: 2400},{name: 'Page b', uv: 400, pv: 200, amt: 2400}])
  const [stockList,setstockList] = useState([])
  const [pcrMonthformat,setpcrMonthformat] = useState("AVG")
  const [monthArr,setMonthArr] = useState(["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"])
  const [pcrmonthArr,setpcrmonthArr] = useState(["AVG"])
  const [stockListvalue,setstockListvalue] = useState([])
  const [StockName,setStockName] = useState({name:"Dabur",shortname:"dabur"})
  const pcrData = useSelector(state => state)
  const dispatch = useDispatch()
  let str1 ,str2,patt,res1,res2;

  useEffect(() => {
    var sendObj = {}
    sendObj["url"] = "fetch";
    sendObj["fetch"] = "fetch";
    sendObj["data"] = {
      find : StockName.shortname,
      pcrMonthformat:pcrMonthformat
    };
    dispatch(fetchData(sendObj))
    return () => {
      
    }
  }, [pcrMonthformat])
  
  useEffect(() => {
    let dateObj  = new Date()
    let month = dateObj.getUTCMonth() + 1;
    let monthNUm = dateObj.getUTCMonth()
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    let pcrmonthArrData = []
    for(let i=0; i<3;i++){
      pcrmonthArrData.push(monthArr[monthNUm])
      if(monthNUm>=11){
        monthNUm = 0;
      }
      else{
        monthNUm ++;
      }
    }
    pcrmonthArrData.push("AVG")
    setpcrmonthArr(pcrmonthArrData)
    var sendObj = {}
    sendObj["url"] = "fetch";
    sendObj["fetch"] = "fetch";
    sendObj["data"] = {
      find : "dabur",
      pcrMonthformat:pcrMonthformat
    };
    dispatch(fetchData(sendObj))
    sendObj = {}
    sendObj["url"] = "fetchstocks";
    sendObj["fetch"] = "fetchstocks";
    sendObj["data"] = {
      find : "all"
    };
    dispatch(fetchData(sendObj))
    return () => {
      
    }
  }, [])

  useEffect(() => {
    if(Object.keys(pcrData.pcrstockReducer.response).length>0){
      setdata(pcrData.pcrstockReducer.response.data)
    }
    if(Object.keys(pcrData.pcrstockReducer.responsestocks).length>0){
      setstockList(pcrData.pcrstockReducer.responsestocks.data)
    }
    
    return () => {
      
    }
  }, [pcrData])

  const showstocks = (params) =>{
    var sendObj = {}
    sendObj["url"] = "fetch";
    sendObj["fetch"] = "fetch";
    sendObj["data"] = {
      find : params["shortname"],
      pcrMonthformat:pcrMonthformat
    };
    dispatch(fetchData(sendObj))
    setStockName(params)
  }

  const handlechange = (e,value) =>{
    setpcrMonthformat(value.props.value)
  }

  const handledownload = () =>{
    var sendObj = {}
    sendObj["url"] = "download";
    sendObj["fetch"] = "download";
    sendObj["data"] = {
      pcrMonthformat:pcrMonthformat
    };
    dispatch(fetchData(sendObj))
  }


  return (
    <>
      {pcrData.pcrstockReducer.loader ==1 && <div className = "loader">
        <CircularProgress color="secondary" />
      </div>}
      {pcrData.pcrstockReducer.loader ==1 && <div className = "overlay"></div>}
      <Grid direction="row" container spacing={2}>
        <Grid item xs={6} style={{"paddingLeft":"60px"}}>
          <h1 style={{"marginLeft":"50px"}}>{StockName.name}</h1>
        </Grid>
        <Grid item xs={2} >
          <TextField onChange={(e)=>setstockListvalue(e.target.value)} id="outlined-basic" style={{"marginLeft":"50px"}} label="Search Stocks" variant="outlined" />
        </Grid>
        <Grid item xs={1} >
          <Box sx={{ minWidth: 80 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-disabled-label">Pcr Format</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={pcrMonthformat}
                label="Pcr Format"
                onChange={handlechange}
              >
                  {pcrmonthArr.length>0  && pcrmonthArr.map(function(value,key){
                    return(
                      <MenuItem value={value}>{value}</MenuItem>
                    )
                  })}
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={1} >
         <Button variant="contained" onClick = {()=>handledownload()}>Download</Button>
        </Grid>
      </Grid>
      <Grid direction="row" container spacing={2}>
        <Grid item xs={10} style={{"paddingLeft":"60px"}}>
          
          <LineChart width={1500} height={380} data={data} >
            <Line type="monotone" dataKey="pcrpoints" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="pcrFormatDate" />
            <YAxis />
            <Tooltip />
          </LineChart>
          <BarChart 
            width={1500}
            height={390} 
            data={data} 
            margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="pcrFormatDate">
              <Label value="" offset={0} position="insideBottom" />
            </XAxis>
            <YAxis label={{ value: '', angle: -90, position: 'insideLeft' }} />
            <Bar dataKey="pcrpoints" fill="#8884d8">
              <LabelList dataKey="pcrpoints" position="top" />
            </Bar>
            <Tooltip />
          </BarChart>
        </Grid>
        <Grid item xs={2} style={{"paddingRight":"10px","height":"100vh","overflow-y":"auto"}}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 100 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell> Short Name</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stockList.length>0 && stockList.map(function(row){
                   str1 = row["name"];
                   str2 = row["shortname"];
                   patt = new RegExp(stockListvalue,"ig");
                   res1 = patt.test(str1);
                   res2 = patt.test(str2);
                  if(stockListvalue){
                    if(res1 || res2){
                      return(
                        <StyledTableRow key={row.name} style={{"cursor":"pointer"}} onClick={()=>showstocks(row)}>
                            <StyledTableCell>{row["name"]}</StyledTableCell>
                            <StyledTableCell>{row["shortname"]}</StyledTableCell>
                        </StyledTableRow>
                      )
                    }
                  }
                  else{
                    return(
                      <StyledTableRow key={row.name} style={{"cursor":"pointer"}} onClick={()=>showstocks(row)}>
                          <StyledTableCell>{row["name"]}</StyledTableCell>
                          <StyledTableCell>{row["shortname"]}</StyledTableCell>
                      </StyledTableRow>
                    )
                  }
                  
                  
                })}
                 
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  )
}

export default ShowPcr
