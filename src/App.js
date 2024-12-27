import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import './App.css'

function App() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:8000/users";

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(API_URL, data);
      setUsers((prev) => [...prev, response.data]);
      setMessage("ПОЛЬЗОВАТЕЛЬ УСПЕШНО СОХРАНЁН");
      reset();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setMessage("ПОЛЬЗОВАТЕЛЬ УСПЕШНО УДАЛЕН");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Управление пользователями</h1>

      <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: "20px" }} className="form">
        <div>
          <label>Имя</label>
          <input {...register("name", { required: "Имя обязательно" })} />
          {errors.name && <p>{errors.name.message}</p>}
        </div>
        <div>
          <label>Email</label>
          <input
            {...register("email", {
              required: "Email обязателен",
              pattern: { value: /^\S+@\S+$/, message: "Неверный формат email" },
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label>Имя пользователя</label>
          <input
            {...register("username", { required: "Имя пользователя обязательно" })}
          />
          {errors.username && <p>{errors.username.message}</p>}
        </div>
        <button type="submit">Создать</button>
      </form>

      <h2>Список пользователей</h2>
      {users.length > 0 ? (
        <table border="1" cellPadding="5" className="table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Имя пользователя</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>
                  <button onClick={() => deleteUser(user.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Список пуст</p>
      )}


      {message && (
        <>
          <div className="modal-backdrop"></div>
          <div className="modal">
            <p>{message}</p>
            <button onClick={() => setMessage("")}>Закрыть</button>
          </div>
        </>
      )}

    </div>
  );
}

export default App;
