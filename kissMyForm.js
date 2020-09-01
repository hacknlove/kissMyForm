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

  const newState = { ...state, ...update };

  if (state.afterChange) {
    setTimeout(state.afterChange, 0, newState);
  }

  return newState;
}

function initializer({ afterChange, initialValues, initialContext }) {
  return {
    afterChange,
    context: { ...initialContext },
    initialContext,
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
  initialContext = staticinitialValues,
  initialValues = staticinitialValues,
} = {}) {
  const [state, dispatch] = useReducer(reducer, {
    afterChange, initialValues, initialContext,
  }, initializer);

  function getValue(name) {
    return state.values[name] === undefined ? '' : state.values[name];
  }

  async function setValue(name, value) {
    if (!beforeChange) {
      dispatch({ values: { ...state.values, [name]: value } });
      return;
    }
    const errors = { ...state.errors };
    const values = { ...state.values, [name]: value };
    const context = { ...state.context };

    await beforeChange({
      context, errors, name, prevValue: state.values[name], value, values,
    });

    const update = {};

    if (isDifferent(state.context, context)) {
      update.context = context;
    }

    if (isDifferent(state.errors, errors)) {
      update.errors = errors;
    }

    if (isDifferent(state.values, values)) {
      update.values = values;
    }

    if (!Object.keys(update).length) {
      return;
    }

    dispatch(update);
  }

  function validate() {
    if (state.hasErrors) return state.hasErrors;
    if (!beforeChange) return 0;

    const values = { ...state.values };
    const errors = { ...state.errors };
    const context = { ...state.context };

    Object.entries(state.values).forEach(([name, value]) => {
      beforeChange({
        name, value, values, errors,
      });
    });

    const update = {};

    if (isDifferent(state.context, context)) {
      update.context = context;
    }

    if (isDifferent(state.errors, errors)) {
      update.errors = errors;
    }

    if (isDifferent(state.values, values)) {
      update.values = values;
    }

    if (!Object.keys(update).length) return 0;

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
    return async (event) => {
      event.preventDefault();
      const errorCount = validate();

      if (errorCount) return errorCount;

      if (!await cb(state.values)) {
        dispatch({ initialValues: state.values });
      }

      return 0;
    };
  }

  function inputControl(name) {
    if (!state.values[name]) {
      state.values[name] = '';
    }
    return { name, value: getValue(name), onChange: setInput };
  }

  function checkboxControl(name) {
    if (!state.values[name]) {
      state.values[name] = false;
    }
    return { name, value: getValue(name), onChange: setChecked };
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
