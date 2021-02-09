import React, { Component } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
} from "reactstrap";
var endpoint = "http://apicalendariomisas.argodevs.com";
export default class DemoApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ofrece: "",
      para: "",
      intencion: "",
      dia: "",
      tel: "",
      hora: "",
      misas: [],
      misas2: [],
      dispon: false,
      dispon2: false,
      newMisa: false,
      numeroDia: "",
      diaFestivo: false,
      numerM1: 0,
      numerM2: 0,
      login: sessionStorage.getItem("Autorized"),
    };
  }
  componentDidMount() {
    setInterval(() => this.numeroMisasDis(), 10);
  }

  componentWillUnmount() {
    clearInterval(this.numeroMisasDis());
  }

  inputChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleDateClick = (arg) => {
    this.setState({ stat: arg });
    this.setState({ dia: arg.dateStr, numeroDia: arg.date.getDay() });
    // eslint-disable-next-line
    if (arg.date.getDay() == 0 || arg.date.getDay() == 3) {
      this.setState({ diaFestivo: true });
      this.buscarMisas(2);
    } else {
      this.setState({ misas2: [] });
      this.setState({ diaFestivo: false });
    }
    this.buscarMisas(1);
    this.numeroMisasDis();
  };

  disponMisas = () => {
    const dia = this.state.numeroDia;

    switch (dia) {
      case 0:
        // eslint-disable-next-line
        if (this.state.misas.length > 19) {
          this.setState({ dispon: false });
        } else {
          this.setState({ dispon: true });
        }
        break;
      default:
        // eslint-disable-next-line
        if (this.state.misas.length > 11) {
          this.setState({ dispon: false });
        } else {
          this.setState({ dispon: true });
        }
        break;
    }
  };
  disponMisas2 = () => {
    const dia = this.state.numeroDia;
    switch (dia) {
      case 0:
        // eslint-disable-next-line
        if (this.state.misas2.length > 19) {
          this.setState({ dispon2: false });
        } else {
          this.setState({ dispon2: true });
        }
        break;
      default:
        // eslint-disable-next-line
        if (this.state.misas2.length > 11) {
          this.setState({ dispon2: false });
        } else {
          this.setState({ dispon2: true });
        }
        break;
    }
  };

  disponM = () => {
    // eslint-disable-next-line
    if (this.state.numeroDia == 0 || this.state.numeroDia == 3) {
      if (this.state.dispon || this.state.dispon2) {
        return (
          <div>
            <h3>Disponible</h3>
            {this.botonNuevaMisa()}
          </div>
        );
      }
    } else {
      if (this.state.dispon) {
        return (
          <div>
            <h3>Disponible</h3>
            {this.botonNuevaMisa()}
          </div>
        );
      }
    }

    // eslint-disable-next-line
    if (this.state.dia == "") {
      return <h3>Seleccionar dia </h3>;
    }
    return <h3>No hay misas disponibles</h3>;
  };
  buscarMisas = async (horaMisa) => {
    const date = this.state.dia;
    await axios
      .post(endpoint + "/api/misas/hora", {
        dia: date,
        hora: horaMisa,
      })
      .then((a) => {
        // eslint-disable-next-line
        if (horaMisa == 2) {
          this.setState({ misas2: a.data });
        } else {
          this.setState({ misas: a.data });
        }
      });
    this.disponMisas();
    this.disponMisas2();
    this.prederemonarHora();
  };
  crearMisa = async (e) => {
    e.preventDefault();
    // eslint-disable-next-line
    if (this.state.numeroDia == 0 || this.state.numeroDia == 3) {
      await axios
        .post(endpoint + "/api/misas", {
          dia: this.state.dia,
          tel: this.state.tel,
          para: this.state.para,
          ofrece: this.state.ofrece,
          hora: this.state.hora,
          intencion: this.state.intencion,
        })
        .then((a) => {
          console.log(a.data);
          this.buscarMisas(1);
          this.buscarMisas(2);
          this.activarM();
        });
    } else {
      await axios
        .post(endpoint + "/api/misas", {
          dia: this.state.dia,
          tel: this.state.tel,
          para: this.state.para,
          ofrece: this.state.ofrece,
          hora: 1,
          intencion: this.state.intencion,
        })
        .then((a) => {
          console.log(a.data);
          this.buscarMisas(1);
          this.buscarMisas(2);
          this.activarM();
          this.numeroMisasDis();
        });
    }
  };

  activarM = () => {
    this.setState({ newMisa: !this.state.newMisa });
  };
  eliminarMisa = async (id) => {
    await axios.delete(endpoint + "/api/misas/" + id).then((a) => {
      console.log(a.data);
      this.buscarMisas(1);
      this.buscarMisas(2);
      this.numeroMisasDis();
    });
  };

  verMisa = () => {
    return (
      <div>
        <div>
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">tel</th>
                <th scope="col">Ofrece</th>
                <th scope="col">Intencion</th>
                <th scope="col">Para</th>
                <th scope="col">Hora</th>
              </tr>
            </thead>
            <tbody>
              {this.state.misas.map((misa) => (
                <tr key={misa._id}>
                  <th scope="row"></th>
                  <td>{misa.tel}</td>
                  <td>{misa.ofrece}</td>
                  <td>{misa.intencion}</td>
                  <td>{misa.para}</td>
                  <td>{this.mostrarMisas(misa.hora)}</td>
                  <td>
                    {" "}
                    {this.state.login ? (
                      <button
                        className="btn btn-danger "
                        onClick={() => this.eliminarMisa(misa._id)}
                      >
                        Delete
                      </button>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
              {this.state.misas2.map((misa) => (
                <tr key={misa._id}>
                  <th scope="row"></th>
                  <td>{misa.tel}</td>
                  <td>{misa.ofrece}</td>
                  <td>{misa.intencion}</td>
                  <td>{misa.para}</td>
                  <td>{this.mostrarMisas(misa.hora)}</td>
                  <td>
                    {" "}
                    {this.state.login ? (
                      <button
                        className="btn btn-danger "
                        onClick={() => this.eliminarMisa(misa._id)}
                      >
                        Delete
                      </button>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  botonMisa = () => {
    return (
      <div className="justify-content-center">
        <Modal isOpen={this.state.newMisa}>
          <ModalHeader>
            <h1>Nueva Misa</h1>
          </ModalHeader>
          <ModalBody>
            <Label htmlFor="title">Misa para el {this.state.dia}</Label>
            <FormGroup className="form-group">
              <Label htmlFor="title">Ofrece</Label>
              <input
                className="form-control-file"
                placeholder="Quien ofrece"
                type="text"
                name="ofrece"
                noValidate
                onChange={this.inputChange}
              />
            </FormGroup>
            <FormGroup className="form-group">
              <Label htmlFor="title">Para</Label>
              <input
                className="form-control-file"
                placeholder="Para"
                type="text"
                name="para"
                noValidate
                onChange={this.inputChange}
              />
            </FormGroup>
            <FormGroup className="form-group">
              <Label htmlFor="title">Intencion</Label>
              <input
                className="form-control-file"
                placeholder="intencion"
                type="text"
                name="intencion"
                noValidate
                onChange={this.inputChange}
              />
            </FormGroup>
            <FormGroup className="form-group">
              <Label htmlFor="title">Telefono</Label>
              <input
                className="form-control-file"
                placeholder="tel"
                type="text"
                name="tel"
                noValidate
                onChange={this.inputChange}
              />
            </FormGroup>
            <div>{this.horaMisa()}</div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              onClick={this.crearMisa}
              className="btn btn-primary"
            >
              Crear
            </Button>
            <Button
              type="submit"
              onClick={this.activarM}
              className="btn btn-primary"
            >
              cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  };
  prederemonarHora = () => {
    if (!this.state.dispon && !this.state.dispon2) {
      this.setState({ hora: "" });
    } else {
      if (!this.state.dispon && this.state.dispon2) {
        this.setState({ hora: 2 });
      } else {
        this.setState({ hora: 1 });
      }
    }
  };

  horaMisa = () => {
    // eslint-disable-next-line
    if (this.state.diaFestivo) {
      if (this.state.dispon && this.state.dispon2) {
        return (
          <div>
            <div className="custom-control custom-radio custom-control-inline">
              <input
                id="1"
                type="radio"
                value="1"
                name="hora"
                className="custom-control-input"
                onChange={this.inputChange}
              ></input>
              <label className="custom-control-label" htmlFor="1">
                Mañana
              </label>
            </div>
            <div className="custom-control custom-radio custom-control-inline">
              <input
                id="2"
                type="radio"
                value="2"
                name="hora"
                className="custom-control-input"
                onChange={this.inputChange}
              ></input>
              <label className="custom-control-label" htmlFor="2">
                Tarde
              </label>
            </div>
          </div>
        );
      } else {
        if (!this.state.dispon && this.state.dispon2) {
          //this.setState({hora:2})
          return <h3>Misa en la tarde</h3>;
        } else {
          return <h3>Misa en la mañana</h3>;
        }
      }
    }
    return "";
  };
  botonNuevaMisa = () => {
    if (this.state.diaFestivo) {
      if (this.state.dispon || this.state.dispon2) {
        return (
          <div>
            <button className="btn btn-danger" onClick={this.activarM}>
              Nueva misa
            </button>
            <br />
            <br />
            <h3>Misas disponibles en la mañana {this.state.numerM1}</h3>
            <h3>Misas disponibles en la tarde {this.state.numerM2}</h3>
          </div>
        );
      }
    } else {
      if (this.state.dispon) {
        return (
          <div>
            <button className="btn btn-danger" onClick={this.activarM}>
              Nueva misa
            </button>
            <br />
            <br />
            <h3>Misas disponibles en la mañana {this.state.numerM1}</h3>
          </div>
        );
      }
    }
  };

  mostrarMisas = (hora) => {
    // eslint-disable-next-line
    if (hora == 1) {
      return "Mañana";
    } else {
      return "Tarde";
    }
  };
  botonLista = async () => {
    window.open(endpoint + "/api/misas/" + this.state.dia);
  };

  numeroMisasDis = () => {
    var disp;
    var disp2;
    switch (this.state.numeroDia) {
      case 0:
        disp = 20 - this.state.misas.length;
        disp2 = 20 - this.state.misas2.length;
        break;
      default:
        disp = 12 - this.state.misas.length;
        disp2 = 12 - this.state.misas2.length;
        break;
    }
    this.setState({ numerM2: disp2 });
    this.setState({ numerM1: disp });
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 p-2">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              dateClick={this.handleDateClick}
              locale={"es"}
            />
          </div>
          <div className="col-md-auto">
            <div>
              <div>
                <h2>Misas {this.state.dia}</h2>
                <br />
                <div>{this.disponM()}</div>
                <div>{this.botonMisa()}</div>
                <button className="btn btn-danger" onClick={this.botonLista}>
                  Exporta lista
                </button>
              </div>
            </div>
          </div>
        </div>
        {this.verMisa()}
      </div>
    );
  }
}
