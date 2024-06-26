import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useForm = (initialForm, validateForm) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitPressed, setSubmitPressed] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Si es un checkbox, actualiza el estado según si está marcado o desmarcado
    if (type === "checkbox") {
      setForm({
        ...form,
        [name]: checked,
      });
    } else {
      // Para otros tipos de inputs, actualiza el estado normalmente
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleBlur = (e) => {
    handleChange(e);
    setErrors(validateForm(form));
  };

  const handleAddressSelect = (selectedOption) => {
    // Extract the address value from the selected option
    const address = selectedOption ? selectedOption.value : "";

    setSelectedAddress(selectedOption);
    // Update the form state with the selected address
    setForm({ ...form, direccion: address });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(validateForm(form));
    setSubmitPressed(true);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      // Validamos que el objeto errors donde guardamos los errores de las validaciones este vacio lo que significa que todos los campos han sido llenados correctamente.
      try {
        await axios.post(
          "https://api-petsion.onrender.com/anfitrion/register",
          {
            username: form.username,
            password: form.password,
            name: form.nombre,
            lastname: form.apellido,
            email: form.email,
            dni: form.dni,
            fechaDeNacimiento: form.fechaDeNacimiento,
            telefono: form.numeroDeTelefono,
            direccion: form.direccion,
            numeroDireccion: form.numeroDireccion,
            codigoPostal: form.codigoPostal,
            tipoDeVivienda: form.tipoDeVivienda,
            conPatio: form.conPatio,
            distintoDueño: form.distintoDueño,
            cantidadDeAnimales: form.cantidadDeAnimales,
            admitePerro: form.admitePerro,
            admiteGato: form.admiteGato,
            admitAlltypesMascotas: form.admiteAlltypesMascotas,
            disponibilidadHoraria: form.disponibilidadHoraria,
            disponibilidadPaseo: form.disponibilidadPaseo,
            disponibilidadVisita: form.disponibilidadVisita,
            disponibilidadAlojamiento: form.disponibilidadAlojamiento,
            disponibilidadlunes: form.disponibilidadlunes,
            disponibilidadmartes: form.disponibilidadmartes,
            disponibilidadmiercoles: form.disponibilidadmiercoles,
            disponibilidadjueves: form.disponibilidadjueves,
            disponibilidadviernes: form.disponibilidadviernes,
            disponibilidadsabado: form.disponibilidadsabado,
            disponibilidaddomingo: form.disponibilidaddomingo,
            tarifaBase: form.tarifaBase,
            cancelaciones: form.cancelaciones,
          }
        );

        navigate("/validate-email");
      } catch (error) {
        // Puedes manejar errores aquí, por ejemplo, mostrar un mensaje de error al usuario
        if (error.response.data.message === undefined) {
          console.log(error.response);
          alert("Algo salio mal, intentalo mas tarde.");
        } else {
          alert(error.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      return;
    }
  };

  return {
    form,
    errors,
    submitPressed,
    loading,
    handleChange,
    handleBlur,
    handleSubmit,
    handleAddressSelect,
    selectedAddress,
  };
};
