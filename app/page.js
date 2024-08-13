'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import {Box, Stack, Typography, Button, Modal, TextField} from "@mui/material"
import {collection, doc, getDocs, query, setDoc, deleteDoc, getDoc} from "firebase/firestore"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() { //export default allows component to be imported to any name in another file
  const [inventory, setInventory] = useState([]) //inventory is initialized with empty array in usestate and setinventory can update inventory
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')


  // fetching data from inventory will freeze site. Make sure it is aynch.
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory')) 
    const docs = await getDocs(snapshot) //retrieve all documents matching query
    const inventoryList = []
    docs.forEach((doc) => { //for each doc that matches query, get the name and and data
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList) //update the component with the new query list
    console.log(inventoryList)
  }


  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory' ), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity+1})
    } else{
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if(quantity ==1){
        await deleteDoc(docRef)
      } else{
        await setDoc(docRef, {quantity: quantity-1})
      }
    }
    await updateInventory()
  }

  useEffect(() => { //retuns updateInventory when something in the dependency array changes
    updateInventory()
  }, []) //empty array ensures that it is only called once, after the component is initially redenered

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
  <Box 
  width = "100vw" 
  height="100vh" 
  display = {"flex"}
  justifyContent={"center"}
  alignItems={"center"}
  gap={2} //spacing between child elements of a box,grid, or flex
  > 
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
          Add Item
      </Typography>

      <Stack width="100%" direction={"row"} spacing={2}>
      <TextField
      id="outlined-basic"
      label="Item"
      variant="outlined"
      fullWidth 
      value ={itemName}
      onChange={(e)=>
        setItemName(e.target.value)}    
      />
      <Button 
      variant="outlined"
      onClick={()=>{
        addItem(itemName)
        setItemName('')
        handleClose()
      }}
      >
          Add
        </Button>
      </Stack>
    </Box>
  </Modal>
  <Button variant="contained" onClick={handleOpen}>
      Add New Item
  </Button>
  <Box border={'1px solid #333'}>
      <Box
        width="800px"
        height="100px"
        bgcolor={'#ADD8E6'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
          Inventory Items
        </Typography>
      </Box>
      <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
        {inventory.map(({name, quantity}) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
            paddingX={5}
          >
            <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
              Quantity: {quantity}
            </Typography>
            <Button variant="contained" onClick={() => removeItem(name)}>
              Remove
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  </Box>
  );
}