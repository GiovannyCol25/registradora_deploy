import React from 'react';

function FormularioEmpleado({ empleado, onChange, onSubmit, onEliminar, onActualizar }) {
  return (
    <div className="text-center mb-4">
      <form onSubmit={onSubmit} className="bg-card-dark shadow-sm p-4 rounded mb-4">
        <div className="row">
          <div className='col-md-6'>
            <div className="mb-3">
              <label htmlFor='nombreEmpleado' className="form-label text-white">Nombre del Empleado</label>
              <input
                type="text"
                name="nombreEmpleado"
                id="nombreEmpleado"
                value={empleado.nombreEmpleado}
                onChange={onChange}
                className="form-control form-control-dark"
              />
            </div>
            <div className="mb-3">
              <label htmlFor='cargo' className="form-label text-white">Cargo</label>
              <input
                type="text"
                name="cargo"
                id="cargo"
                value={empleado.cargo}
                onChange={onChange}
                className="form-control form-control-dark"
              />
            </div>
            <div className="mb-3">
              <label htmlFor='telefono' className="form-label text-white">Teléfono</label>
              <input
                type="number"
                name="telefono"
                id='telefono'
                value={empleado.telefono}
                onChange={onChange}
                className="form-control form-control-dark"
              />
            </div>
          </div>

            <div className='col-md-6'>
            <h6 className="text-white mb-3">🧾 Datos de Usuario</h6>
              <div className='mb-3'>
                <label htmlFor='login' className="form-label text-white">Usuario (login)</label>
                <input
                  type="text"
                  name="login"
                  id="login"
                  value={empleado.usuario.login}
                  onChange={onChange}
                  className="form-control form-control-dark"
                />
              </div>
              <div className="mb-3">
                <label htmlFor='clave' className="form-label text-white">Contraseña</label>
                <input
                  type="password"
                  name="clave"
                  id="clave"
                  value={empleado.usuario.clave}
                  onChange={onChange}
                  className="form-control form-control-dark"
                />
              </div>
              <div className="mb-3">
                <label htmlFor='rol' className="form-label text-white">Rol</label>
                <select
                  name="rol"
                  id="rol"
                  value={empleado.usuario.rol}
                  onChange={onChange}
                  className="form-control form-control-dark"
                >
                  <option value="VENDEDOR">VENDEDOR</option>
                  <option value="ALMACENISTA">ALMACENISTA</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className='mb-3 d-flex gap-2'>
              
            </div>
          </div>
        </div>
      </form>
      <button type="submit" className="btn btn-primary">
        Registrar
      </button>
      <button type="button" className="btn btn-primary ms-2" onClick={onActualizar}>
        Actualizar
      </button>   
  </div>
  );
}

export default FormularioEmpleado;
