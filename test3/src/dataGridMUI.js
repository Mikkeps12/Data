import React, { useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { Input, TextField, Button, Dialog, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import  Autocomplete  from '@mui/material/Autocomplete';

  const DataGridMUI = () => {
    const [user, setUser] = useState([]);
    const [object, setObject] = useState([]);
    const [Name, setName] = useState('')
    const [Location, setLocation] = useState('');
    const [selctObject, setSelectObject] = useState('');
    const [open, setOpen] = useState(Boolean)
    const [newObject, setNewobject] = useState('');
    const [newObjectId, setNewobjectId] = useState('');
    const [date, setDate] = useState(Date);
    const url = 'http://localhost:5289/api/Values/';
    const [state, setState] = useState(Boolean);
    const columnsObject = [
    
      { field: 'Object', headerName: 'Inventarie', width: 190 },
      { field: 'Object_Id', headerName: 'Id', width: 190 },
      { field: 'Action', headerName: '', width: 20, renderCell: (params) =>{
        const onHandleDeleteObject = () => {
          let d = params.id;
          DeleteObject(d);
        }
        return[
          <GridActionsCellItem
         icon={<DeleteIcon />}
         onClick={onHandleDeleteObject} />
        ]  
      }
    }
  ];

    const columns = [
    
      { field: 'Name', headerName: 'Namn', width: 200, editable: true },
      { field: 'Date', headerName: 'Lånedatum', width: 200, editable: false },
      { field: 'Object', headerName: 'Inventarie', width: 200, editable: false },
      { field: 'Object_Id', headerName: 'Id', width: 40, editable: false },
      { field: 'Location', headerName: 'Placering', width: 190, editable: true },
      { field: 'Action', headerName: '', width: 20, renderCell: (params) => {
          const onHandleDelete = (e) => {
            let d = params.id;
            Delete(d);
          }
        return[
         <GridActionsCellItem
            icon={<DeleteIcon />} 
            onClick={onHandleDelete}
            />
        ]
      }
    }       
  ];

  const Delete = (id) => {
      axios.delete(url+id)  
    }
     
const DeleteObject = (id) => {
    axios.delete(`${url}Object/${id}`)
    setState(true);
}

const onHandleCommit = (e) => {
      rowData.forEach(r => {
            if(r.id===e.id){
            axios.put(url+r.id, e);
            }
      });
};

const saveData = () => {
        const json1 = {"Name":Name, "Location":Location, "Date":date, "Object":selctObject}
        axios.post(`${url}Borrower`, json1);     
}

const saveObject = () => {
      setOpen(true);
}

const fetchStorageData = async() => {
      try{
        const res = await fetch(`${url}objects`);
        const data = await res.json();
        const data2 = await JSON.parse(data);
        setObject(data2);
      }
      catch(error) {}
    }

const options = object.map((object) =>{
        return[
            object.Object1+" Id: "+object.Object_Id,
        ]   
      });

const getFile = async() => {
        await fetch(`${url}file`).then((response) => {
              response.blob().then(blob => {     
        const u = window.URL.createObjectURL(new Blob([blob], { type: 'application/json' }));
        const link = document.createElement('a');
        link.href = u;
        link.download = "Dasa_utlåning_lista.xlsx";
        link.click();   
              })
        })
}     
      
const fetchData = async() => {
      try{
        const res = await fetch(`${url}Borrower`);
        const data = await res.json();
        const data2 = await JSON.parse(data);
        setUser(data2);
      }
      catch(error) {}
}
    
useEffect(() => {
      fetchData();
      fetchStorageData();
},[user])

const rowData = user.map(user => {
    return{
      Name: user.Name,
      Location: user.Location,
      Date: user.Date,
      Object: user.Object,
      Object_Id: user.Object_Id,
      id: user.Id
    }
});

const rowObject = object.map((object) => {
  return{
        id: object.Id,
        Object: object.Object1,
        Object_Id: object.Object_Id,
  }
 });

const Cancel = () => {
  setOpen(false);
}

const Confirm = () => {
  const json = {"Object": newObject, "Object_Id": newObjectId}
  axios.post(`${url}Object`, json);
}
return (
      <div style={{maxWidth: 900, height: 400, marginLeft: 400}}>
        <Button onClick={getFile}>Skapa Excelfil</Button>
        <Button onClick={saveObject}>Lägg till inventarie</Button>
        <DataGrid 
        rows={rowData}
        columns={columns}
        onCellEditCommit={onHandleCommit} />
        <br /><br />
          <form style={{maxWidth: 900, backgroundColor: 'aliceblue', display: 'flex'}}>
            <Input placeholder="Namn" type={'text'} style={{width: 200 }} value={Name} onChange={(e) => setName(e.target.value)}></Input>
            <Input placeholder="Date" type={'date'} onChange={(e) => setDate(e.target.value)}></Input>
            <Autocomplete
            options={options}
            style={{ width: 210 }}
            renderInput={(params) =>
              <TextField {...params} label="Inventarie" variant="outlined" />}
            onSelect={(e) => setSelectObject(e.target.value)} />
            <Input placeholder="Placering" type={'text'} value={Location} onChange={(e) => setLocation(e.target.value)}></Input>
            <Button style={{backgroundColor: 'white', width: 120}} onClick={saveData} >Låna</Button>  
          </form>
      <>
        <Dialog open={open} >
          <DialogContent style={{width: 445, height: 400}}>
            <DialogContentText>
              <DataGrid style={{height: 290}}
              rows={rowObject}
              columns={columnsObject} />
                <br />
               <br />
                Lägg till nya inventarie
                <br/>
              <Input placeholder='Inventarie' 
              style={{width: 220, backgroundColor: 'aliceblue' }}
              onChange={(e) => setNewobject(e.target.value)}
              ></Input>
              <Input placeholder='Id'
               style={{width: 220, backgroundColor: 'aliceblue'}}
               onChange={(e) => setNewobjectId(e.target.value)}
               ></Input>          
            </DialogContentText>
          </DialogContent>
            <DialogActions>
              <Button id="Cancel" onClick={Cancel}>
              Stäng
              </Button>
              <Button id="Confirm" autoFocus onClick={Confirm} color="primary">
              Spara
              </Button>
            </DialogActions>
        </Dialog>
        </>
      </div>
    );  
  }
  
  export default DataGridMUI


