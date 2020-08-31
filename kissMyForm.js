/* eslint-disable no-param-reassign */
import { useReducer } from 'react';
import { isDifferent } from 'isdifferent';

function reducer(state, update) {
  if (update.values || update.initialValues) {
    update.isDirty = isDifferent(
      update.values || state.values,
      update.initialValues || state.initialValues,
    );
  }

  if (update.errors) {
    update.hasErrors = Object.keys(update.errors).length;
  }

  const newState = {
    ...state,
    ...update,
  };

  if (state.afterChange) {
    setTimeout(state.afterChange, 0, newState);
  }

  return newState;
}

function initializer({ afterChange, initialValues }) {
  return {
    afterChange,
    initialValues,
    errors: {},
    hasErrors: 0,
    isDirty: false,
    values: { ...initialValues },
  };
}

const staticinitialValues = {};

export default function kissMyForm({
  afterChange,
  beforeChange,
  initialValues = staticinitialValues,
} = {}) {
  const [state, dispatch] = useReducer(reducer, { afterChange, initialValues }, initializer);

  function getValue(name) {
    return state.values[name] === undefined ? '' : state.values[name];
  }

  function setValue(name, value) {
    if (!beforeChange) {
      dispatch({ values: { ...state.values, [name]: value } });
      return;
    }
    const errorsCopy = { ...state.errors };
    const valuesCopy = { ...state.values };

    beforeChange({
      errors: errorsCopy,
      name,
      value,
      values: valuesCopy,
    });

    const update = {};

    if (isDifferent(state.errors, errorsCopy)) {
      update.errors = errorsCopy;
    }

    if (isDifferent(state.values, valuesCopy)) {
      update.values = valuesCopy;
    } else if (value !== state.values[name]) {
      valuesCopy[name] = value;
      update.values = valuesCopy;
    }

    if (!Object.keys(update).length) {
      return;
    }

    dispatch(update);
  }

  function validate() {
    if (state.hasErrors) {
      return state.hasErrors;
    }
    if (!beforeChange) {
      return 0;
    }

    const values = { ...state.values };
    const errors = { ...state.errors };

    Object.entries(state.values).forEach(([name, value]) => {
      beforeChange({
        name, value, values, errors,
      });
    });

    const update = {};

    if (isDifferent(state.errors, errors)) {
      update.errors = errors;
    }

    if (isDifferent(state.values, values)) {
      update.values = values;
    }

    if (!Object.keys(update).length) {
      return 0;
    }

    dispatch({ values, errors });
    return Object.keys(errors).length;
  }

  function setInput({ target: { name, value } }) {
    setValue(name, value);
  }
  function setChecked({ target: { name, checked } }) {
    setValue(name, checked);
  }

  function handleSubmit(cb) {
    return (event) => {
      event.preventDefault();
      const errorCount = validate();
      if (errorCount) {
        return errorCount;
      }

      const cancel = cb(state.values);
      if (!cancel) {
        dispatch({ initialValues: state.values });
      }
      return 0;
    };
  }

  function inputControl(name) {
    if (!state.values[name]) {
      state.values[name] = '';
    }
    return {
      name,
      value: getValue(name),
      onChange: setInput,
    };
  }

  function checkboxControl(name) {
    if (!state.values[name]) {
      state.values[name] = false;
    }
    return {
      name,
      value: getValue(name),
      onChange: setChecked,
    };
  }

  return {
    checkboxControl,
    dispatch,
    getValue,
    handleSubmit,
    inputControl,
    setChecked,
    setInput,
    setValue,
    state,
  };
}
