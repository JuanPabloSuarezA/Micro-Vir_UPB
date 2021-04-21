import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const PathForm = ({ path, handlePath }) => {
  const [state, setState] = useState({ normalPath: "", apiPath: "" });
  useEffect(() => setState(processPath(path)), [path]);

  const processPath = (path) => {
    const normalPath = path ? path.replace(/--/g, "/") : "";
    const apiPath = path ? path.replace(/\//g, "--") : "";

    return { normalPath, apiPath };
  };

  const handleChange = (e) => {
    setState(processPath(e.target.value));
  };
  const handleClick = (e) => {
    handlePath(state.normalPath, state.apiPath);
    e.preventDefault();
  };
  return (
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          type="text"
          className="mb-2"
          value={state.normalPath}
          onChange={(e) => handleChange(e)}
        />
        <Button
          size="lg"
          variant="primary"
          type="button"
          onClick={(e) => handleClick(e)}
        >
          Ingresar
        </Button>
      </Form.Group>
    </Form>
  );
};

export default PathForm;
