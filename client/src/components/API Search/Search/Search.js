import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import "./Search.css";
import axios from "axios";
import Swal from "sweetalert2";

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  button: {
    margin: theme.spacing.unit
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

class OutlinedTextFields extends Component {
  state = {
    open: false,
    value: 0
  };

  handleChange = event => {
    this.setState({ parameter: event.target.value });
    // console.log(this.state.parameter);
  };

  handleTabs = (event, value) => {
    this.setState({ value }, () => {
      switch (this.state.value) {
        case 0:
          this.setState({
            new_temp: this.state.temp,
            new_temp_min: this.state.temp_min,
            new_temp_max: this.state.temp_max,
            degree: " K"
          });
          break;
        case 1:
          this.setState({
            new_temp: parseFloat(this.state.temp - 273.15).toFixed(2),
            new_temp_min: parseFloat(this.state.temp_min - 273.15).toFixed(2),
            new_temp_max: parseFloat(this.state.temp_max - 273.15).toFixed(2),
            degree: " °C"
          });
          break;
        case 2:
          this.setState({
            new_temp: parseFloat(
              ((this.state.temp - 273.15) * 9) / 5 + 32
            ).toFixed(2),
            new_temp_min: parseFloat(
              ((this.state.temp_min - 273.15) * 9) / 5 + 32
            ).toFixed(2),
            new_temp_max: parseFloat(
              ((this.state.temp_max - 273.15) * 9) / 5 + 32
            ).toFixed(2),
            degree: " °F"
          });
          break;
      }
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  removeSubmit = e => {
    e.preventDefault();
  };

  handleKeyDown = e => {
    if (e.key === "Enter") {
      this.setState({ open: true });
      this.handleApiRequest(this.state.parameter);
    } else {
      this.setState({ open: false });
    }
  };

  handleApiRequest = userQuery => {
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/weather?apikey=355e806e0c6b3aa9c5c24c36144d073b&q=` +
          userQuery
      )
      .then(res => {
        this.setState({
          weather: res.data,
          temp: res.data.main.temp,
          temp_min: res.data.main.temp_min,
          temp_max: res.data.main.temp_max,
          new_temp: res.data.main.temp,
          new_temp_min: res.data.main.temp_min,
          new_temp_max: res.data.main.temp_max,
          degree: " K"
        });
        console.log(this.state.weather);
      })
      .catch(error => {
        this.setState({
          open: false
        });

        Swal.fire({
          title: "Error!",
          text:
            'Invalid entry. No results were found for "' +
            this.state.parameter +
            '".',
          type: "error"
        });
      });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <>
        <form
          className="search-container"
          onSubmit={this.removeSubmit}
          onKeyDown={this.handleKeyDown}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-name"
            label="Sky Tidings&nbsp;&nbsp;"
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"
            helperText={
              <sm className="helper-text">Enter a City or ZIP Code</sm>
            }
          />
        </form>

        {this.state.weather ? (
          <Dialog
            onClose={this.handleClose}
            aria-labelledby="customized-dialog-title"
            open={this.state.open}
            className="dialog-box"
          >
            <div className="title-format">
              <img
                className="weather-icon"
                alt="Weather Icon"
                src={
                  "http://openweathermap.org/img/w/" +
                  this.state.weather.weather[0].icon +
                  ".png"
                }
              />
              <DialogTitle
                id="customized-dialog-title"
                onClose={this.handleClose}
              >
                {this.state.weather.name} ({this.state.weather.weather[0].main})
                <br /> Lat: {this.state.weather.coord.lat.toFixed(2)} Lon:{" "}
                {this.state.weather.coord.lon.toFixed(2)}
              </DialogTitle>
            </div>
            <DialogContent className="dialog-content" dividers>
              <Grid container spacing={24} className="icon-group">
                <Grid item xs={4} className="centering-icons">
                  <i class="fas fa-temperature-low" />
                </Grid>
                <Grid item xs={4} className="centering-icons">
                  <i class="fas fa-cloud-sun" />
                </Grid>
                <Grid item xs={4} className="centering-icons">
                  <i class="fas fa-temperature-high" />
                </Grid>
                <Grid item xs={4}>
                  <p>{this.state.new_temp_min + this.state.degree}</p>
                </Grid>
                <Grid item xs={4}>
                  <p>{this.state.new_temp + this.state.degree}</p>
                </Grid>
                <Grid item xs={4}>
                  <p>{this.state.new_temp_max + this.state.degree}</p>
                </Grid>
                <Grid item xs={4}>
                  <p className="format-paragraph">Low</p>
                </Grid>
                <Grid item xs={4}>
                  <p className="format-paragraph">Current</p>
                </Grid>
                <Grid item xs={4}>
                  <p className="format-paragraph">High</p>
                </Grid>
              </Grid>
              <Paper square className="format-temps">
                <Tabs
                  value={this.state.value}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={this.handleTabs}
                  centered
                >
                  <Tab label="Kelvin" active />
                  <Tab label="Celsius" />
                  <Tab label="Fahrenheit" />
                </Tabs>
              </Paper>
            </DialogContent>
          </Dialog>
        ) : (
          false
        )}
      </>
    );
  }
}

OutlinedTextFields.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OutlinedTextFields);
