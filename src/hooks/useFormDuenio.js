import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useForm = (initialForm, validateForm) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitPressed, setSubmitPressed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleBlur = (e) => {
    handleChange(e);
    setErrors(validateForm(form));
  };

  const handleSubmit = async (e) => {
    setSubmitPressed(true);
    e.preventDefault();
    setErrors(validateForm(form));
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      // Validamos que el objeto errors donde guardamos los errores de las validaciones este vacio lo que significa que todos los campos han sido llenados correctamente.
      try {
        await axios.post("https://api-petsion.onrender.com/user/register", {
          username: form.username,
          password: form.password,
          email: form.email,
          fechaDeNacimiento: form.fechaDeNacimiento,
          name: form.nombre,
          lastname: form.apellido,
          dni: form.dni,
          telefono: form.numeroDeTelefono,
          codigoPostal: form.codigoPostal,
        });

        navigate("/validate-email");
      } catch (error) {
        // Puedes manejar errores aquí, por ejemplo, mostrar un mensaje de error al usuario
        if (error.response.data.message === undefined) {
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
  };
};
