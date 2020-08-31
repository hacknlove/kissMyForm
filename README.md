# Kiss My Form

**Kiss My Form** is probably the most simple yet powerfull react form helper out there.

180 lines of very clear and readable code, are enough to enhance your DX and make it possible to bring your users a great form's UX with very little effort and verbosity.

## Demos and Examples
[google pages](https://hacknlove.github.io/kissMyForm/)

### Hello-Word-ish Example

```javascript
import useKMF from 'useKMF'

exports default SomeFormComponent ({ onSubmit }) {
  const { inputControl, handleSubmit } = useKMF()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...inputControl('username')} />
      <input {...inputControl('password')} type="password" />
      <button> Login </button>
    </form>
  )
}
```

## API overview

### useKMF (options) => helpers

React hook that help you manage the form.

### options

* `afterChange(state)` function that is called each after the form state is updated.
* `beforeChange({ name, value, values, errors })` function that is called before the form state is updated. `values`and `errors` can be mutated to change the update.
* `initialValues`: object with the initial values of the form.

### helpers

* `checkboxControl(name)`: sintactic sugar for `name={name} value={getValue(name)} onChange={setChecked}`.
* `dispatch(newState)`: Updates the form state, computing `isDirty` and `hasErrors`, and calling `afterChange`.
* `getValue(name)`: returns the value of the form element whose name is `name`.
* `handleSubmit(callback)`: it calls `callback` when the form is submitted if there is no errors.
* `inputControl(name)`:  sintactic sugar for `name={name} value={getValue(name)} onChange={setInput}`.
* `setChecked`: handler for the `onChange` events of checkboxes that updates the state of the form.
* `setInput`:  handler for the `onChange` events of inputs, textareas and selects that updates the state of the form.
* `setValue(name, value)`: calls `beforeUpdate` and then updates the state of the form.
* `state`: the state of the form `{ afterChange, initialValues, errors, hasErrors, isDirty, values }`.


## Hook:


### `useKMF`
```javascript
 const { inputControl, handleSubmit } = useKMF()
```
`useKMF` is a react hook, it should be used like all the react hooks: it cannot be called conditionally and it only be called from inside components or hooks.

## Options

### `afterChange(state) => undefined`
```javascript
 const { inputControl, handleSubmit } = useKMF({ afterChange })
```

It is called after any update of the form's state with the state as parameter.

Your component is supposed to be organized around reactivity, so everytime the you component funcion is called again, you check the state values and act accordingly. Buy you might want to pass an event handler from the component's parent. So it can change its state when the form has errors for instance. `afterChange` is meant for this.

### `beforeChange({ name, value, values, errors }) => undefined`
```javascript
 const { inputControl, handleSubmit } = useKMF({ beforeChange })
```
It is called before any update of the form's state with the state as parameter.

It is also called before submiting the form, once for each [name, value], and then all the changes you have made to values and errors are dispatches at once.
You can use it to validate or transform the change.

### `initialValues`
`initialValues` is one of the optional parameters that can be passed to `useKMF`.

It establishs the form's initial values at initialization time.

After form's initializaton, any change of `initialValues` could reload the component, but won't change its current values.

## Helpers

### `{...checkboxControl('name')}

it's a sintaxis-sugar helper that sets some values that the checkbox element to be managed.

It is equivalent to write `name={name} value={getValue(name)} onChange={setChecked}`.

### `dispatch({ values, errors, initialValues })`
You can call dispatch to update the state of the form. All fields are optional, so if you want to update just the errors you can omit the values and the initialValues.

You could add `isDirty` and `hasErrors`, but that make no sense because those values are recomputed after aplying the new values.

dispatch will trigger `afterChange`. but it will not trigger `beforeChange`.


### `getValue(name) => string | boolean | any`
It returns the value of the form element whose name is `name`.

You can also use `state.values[name]`.


### `onSubmit={handleSubmit(callback)}

It handles the onSubmit event of the form element.

It calls `callback(values)` if there is no errors.

### `{...inputControl(name)}`

it's a sintaxis-sugar helper that sets some values that the checkbox element to be managed.

It is equivalent to write `name={name} value={getValue(name)} onChange={setInput}`.

### `onChange={setChecked}`

It handles the onChange event for checkboxes.


### `onChange={setInput}`
It handles the onChange event for inputs, textareas and selects.

### `setValue(name, value)`

It calls `beforeUpdate` and then updates the state.

### `state`

the state of the form has the following fields:

* `afterChange`: The function set as `afterChange` in the `options`. You can change it with `dispatch`.
* `initialValues`:  The object that holds the initial values, as you pass in within the `options`. You can change it with `dispatch`, but it will not affect the current values. It could affect `isDirty` though.
* `errors`: It stores whatever errors you set with `beforeChange`. You can change it with `dispatch`, and it will affect `hasErrors`.
* `hasErrors`: The ammount of values of the `errors` object. You cannot change it with `dispath`. It is computed by `dispatch`.
* `isDirty`: Boolean that shows whether `values` is deeply equal to `initialValues`.
* `values`: It store the values of your form. It is the parameter of the callback that `handleSubmit` calls. You can change it with `dispatch`.
