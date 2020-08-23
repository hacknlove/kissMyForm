/* eslint-disable no-param-reassign */
import { useReducer } from 'react';

function reducer(state, action) {
  return {
    ...state,
    action,
  };
}

function initializer({ defaultValues, defaultContext }) {
  return {
    values: { ...defaultValues },
    context: { ...defaultContext },
    errors: {},
    hasErrors: 0,
    isDirty: false,
  };
}

const staticDefaultValues = {};

export default function useControlledForm({
  hook,
  values: defaultValues = staticDefaultValues,
  context: defaultContext,
  onIsDirtyChange,
  onHasErrorsChange,
  onValuesChange,
  onContextChange,
}) {
  const [state, dispatch] = useReducer(reducer, { defaultValues, defaultContext }, initializer);

  function getValue(name) {
    // return state.values[name] ?? '';
    return state.values[name] === undefined ? '' : state.values[name];
  }

  function setValue(name, value) {
    const valuesCopy = { ...state.values };
    const errorsCopy = { ...state.errors };
    const contextCopy = { ...state.context };

    const {
      value: newValue = valuesCopy[name],
      values: newValues = valuesCopy,
      errors: newErrors = errorsCopy,
      context: newContext = contextCopy,
    } = hook({
      value, values: valuesCopy, errors: errorsCopy, name, context: contextCopy,
    });

    const update = {};

    if (newValues !== valuesCopy) {
      update.values = newValues;
      update.isDirty = true;
    } else if (newValue !== newValues[name]) {
      update.values = {
        ...newValues,
        [name]: newValue,
      };
      update.isDirty = true;
    }

    if (newContext !== contextCopy) {
      update.context = newContext;
    }
    if (newErrors !== errorsCopy) {
      update.errors = newErrors;

      const errorsCount = Object.keys(newErrors).length;
      if (state.hasErrors !== errorsCount) {
        update.errorsCount = errorsCount;
      }
    }
    if (!Object.keys(update).length) {
      return;
    }

    dispatch(update);

    if (update.values && onValuesChange) {
      onValuesChange(newValues);
    }
    if (update.isDirty && onIsDirtyChange) {
      onIsDirtyChange(update.isDirty);
    }
    if (update.context && onContextChange) {
      onContextChange(newValues);
    }
    if (update.errorsCount) {
      onHasErrorsChange(update.errorsCount);
    }
  }

  function setInput({ target: { name, value } }) {
    setValue(name, value);
  }
  function setChecked({ target: { name, checked } }) {
    setValue(name, checked);
  }

  function validate() {
    const valuesCopy = { ...state.values };
    const errorsCopy = { ...state.errors };
    const contextCopy = { ...state.context };

    const update = {};

    const {
      errors: newErrors = errorsCopy,
    } = reducer({
      values: valuesCopy, errors: errorsCopy, context: contextCopy,
    });

    if (newErrors !== errorsCopy) {
      update.errors = newErrors;

      const errorsCount = Object.keys(newErrors).length;
      if (state.hasErrors !== errorsCount) {
        update.errorsCount = errorsCount;
      }
    }

    if (!Object.keys(update).length) {
      return state.errorsCount;
    }

    dispatch(update);

    if (update.errors || update.errorsCount) {
      onHasErrorsChange(update.errorsCount);
    }

    return update.errorsCount;
  }

  function handleSubmit(cb) {
    return (event) => {
      event.preventDefault();
      if (validate()) {
        return;
      }
      const cancel = cb(state.values);
      if (!cancel) {
        if (state.isDirty && onIsDirtyChange) {
          onIsDirtyChange(false);
        }
        dispatch({ isDirty: false });
      }
    };
  }

  function inputControl(name) {
    return {
      name,
      value: getValue(name),
      onChange: setValue(name),
    };
  }

  function checkboxControl(name) {
    return {
      name,
      value: getValue(name),
      onChange: setChecked(name),
    };
  }

  return {
    state,
    dispatch,
    validate,
    setValue,
    getValue,
    setInput,
    setChecked,
    handleSubmit,
    inputControl,
    checkboxControl,
  };
}
