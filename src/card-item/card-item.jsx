import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormHelperText,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import "./card-item.css";

const schema = yup.object().shape({
  pin: yup
    .string()
    .required("Pin is required")
    .length(4)
    .matches(/^\d+$/, "Pin must be a number"),
  verifyPin: yup
    .string()
    .required("Confirm Pin is required")
    .oneOf([yup.ref("pin")], "Pins must match"),
});

const initialValues = {
  pin: "",
  verifyPin: "",
};

const CardItem = () => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setCardDetails({
        cardNumber: "1234 5678 9012 3456",
        cardType: "Physical",
        cardStatus: "Activated",
      });
    }, 2000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSavePin = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      alert("Pin changed successfully");
      setOpenModal(false);
      setAnchorEl(null);
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        width: " 100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        variant="outlined"
        style={{
          width: 350,
          height: 220,
          backgroundColor: "rgb(204, 39, 121)",
          borderRadius: 15,
          position: "relative",
        }}
        className={!cardDetails ? "center-div" : ""}
      >
        {!cardDetails ? (
          <CircularProgress color="secondary" />
        ) : (
          <CardContent
            style={{
              padding: 20,
              color: "white",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <IconButton
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                color: "#fff",
                zIndex: 1,
              }}
              onClick={handleMenuOpen}
            >
              <FontAwesomeIcon icon={faCog} />
            </IconButton>
            <Typography variant="h6" style={{ fontSize: 18, marginBottom: 10 }}>
              Image
            </Typography>
            <Typography
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
            >
              {`**** **** **** ${cardDetails.cardNumber.slice(-4)}`}
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginTop={2}
              marginBottom={1}
            >
              <Typography variant="body2" style={{ fontSize: 14 }}>
                Cardholder Name
              </Typography>
              <Typography variant="body2" style={{ fontSize: 14 }}>
                Exp: 12/24
              </Typography>
            </Box>
            <Typography
              variant="body1"
              style={{ fontSize: 16, fontWeight: "bold" }}
            >
              John Doe
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginTop={4}
            >
              <Typography variant="body2" style={{ fontSize: 14 }}>
                {cardDetails.cardType}
              </Typography>
              <Typography variant="body2" style={{ fontSize: 14 }}>
                {cardDetails.cardStatus}
              </Typography>
            </Box>
          </CardContent>
        )}
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenModal}>Change Pin</MenuItem>
        {/* Add additional menu items here */}
      </Menu>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 300,
          }}
        >
          <TextField
            name="pin"
            label="Enter PIN"
            value={formData.pin}
            onChange={handleChange}
            fullWidth
          />
          <FormHelperText error>{errors.pin}</FormHelperText>

          <TextField
            name="verifyPin"
            label="Re-Enter PIN"
            value={formData.verifyPin}
            onChange={handleChange}
            fullWidth
          />
          <FormHelperText error>{errors.verifyPin}</FormHelperText>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleSavePin} variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default CardItem;
