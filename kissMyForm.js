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
    update.hasErrors = Object.values(update.errors).reduce(
      (previousValue, currentValue) => previousValue + Number(Boolean(currentValue)),
      0,
    );
  }

  const newState = { ...state, ...update };

  if (state.afterChange && isDifferent(state, newState)) {
    if (state.debounced) {
      clearTimeout(state.debounced);
    }
    state.debounced = setTimeout(state.afterChange, state.afterChangeDebounce, newState);
  }

  return newState;
}

function initializer({
  afterChange, afterChangeDebounce = 0, initialValues, initialContext
}) {
  return {
    afterChange,
    afterChangeDebounce,
    context: { ...initialContext },
    initialContext: { ...initialContext },
    initialValues: { ...initialValues },
    errors: {},
    hasErrors: 0,
    isDirty: false,
    values: { ...initialValues },
  };
}

const staticinitialValues = {};

export default function kissMyForm({
  afterChange,
  afterChangeDebounce = 0,
  beforeChange,
  initialContext = staticinitialValues,
  initialValues = staticinitialValues,
} = {}) {
  const [state, dispatch] = useReducer(reducer, {
    afterChange, initialValues, initialContext, afterChangeDebounce,
  }, initializer);

  function getValue(name) {
    return state.values[name] === undefined ? '' : state.values[name];
  }

  function setValue(name, value) {
    if (!beforeChange) {
      dispatch({ values: { ...state.values, [name]: value } });
      return;
    }
    const errors = { ...state.errors };
    const values = { ...state.values, [name]: value };
    const context = { ...state.context };

    beforeChange({
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
        name, value, values, errors, context,
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
    return Object.values(update.errors).reduce(
      (previousValue, currentValue) => previousValue + Number(Boolean(currentValue)),
      0,
    );
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

      if (!cb) {
        return 0;
      }

      const what = await cb(state.values, { state }, dispatch);

      switch (what) {
        case true:
        case 'update':
          dispatch({ initialValues: state.values });
          break;
        case false:
        case 'reset':
          dispatch({ values: state.initialValues });
          break;
        case undefined:
        case 'keep':
        default:
      }
      return 0;
    };
  }

  function inputControl(name) {
    if (!state.values[name]) {
      state.values[name] = '';
      state.initialValues[name] = '';
    }
    return { name, value: getValue(name), onChange: setInput };
  }

  function checkboxControl(name) {
    if (!state.values[name]) {
      state.values[name] = false;
      state.initialValues[name] = false;
    }
    return { name, checked: getValue(name), onChange: setChecked };
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
