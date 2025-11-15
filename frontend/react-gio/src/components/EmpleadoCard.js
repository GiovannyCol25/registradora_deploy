import React from 'react';

const EmpleadoCard = ({ empleado, onEdit, onDelete }) => {
  return (
    <div className="card mb-3 p-3">
      <h5>{empleado.nombreEmpleado}</h5>
      <p><strong>Cargo:</strong> {empleado.cargo}</p>
      <p><strong>Teléfono:</strong> {empleado.telefono}</p>
      <button className="btn btn-warning me-2" onClick={() => onEdit(empleado)}>Editar</button>
      <button className="btn btn-danger" onClick={() => onDelete(empleado.id)}>Eliminar</button>
    </div>
  );
};

export default EmpleadoCard;
