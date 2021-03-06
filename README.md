# Warning - DEPRECATED

I am deprecating this librery, because it has not worked well with a new scenario I run into, in which I needed the form to be spreaded in many tabs and components. I could have passed the functions and state from parents to children through properties but it did not felt right, and in this complex scenario I care about too many refreshes.

I will keep maintaining it as long as I stil use it a couple of places in production, but I won't use it in new projects and sooner or later those old projects will end or will be updated. 

# Kiss My Form

**Kiss My Form** is probably the most simple yet powerfull react form helper out there.

## Demos and Examples
[demo and examples](https://hacknlove.github.io/kissMyForm/)

### Hello-Word-ish Example

```javascript
import useKMF from 'kissmyform'

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

* `afterChange(state)` function that is called each after the form values is updated.
* `afterChangeDebounce` If set, the afterChange function will be debounced this amount of miliseconds. 
* `beforeChange({ context, errors, name, value, values })` function that is called before the form state is updated. `values`and `errors` can be mutated to change the update.
* `initialContext`: object with the initial context of the form. Context are values that your form use to know how to behave, but it is not intended to be submited.
* `initialValues`: object with the initial values of the form.

### helpers

* `checkboxControl(name)`: sintactic sugar for `name={name} checked={getValue(name)} onChange={setChecked}`.
* `dispatch(newState)`: Updates the form state, computing `isDirty` and `hasErrors`, and calling `afterChange`.
* `getValue(name)`: returns the value of the form element whose name is `name`.
* `handleSubmit(callback)`: it calls `callback` when the form is submitted if there is no errors.
* `inputControl(name)`:  sintactic sugar for `name={name} value={getValue(name)} onChange={setInput}`.
* `setChecked`: handler for the `onChange` events of checkboxes that updates the state of the form.
* `setInput`:  handler for the `onChange` events of inputs, textareas and selects that updates the state of the form.
* `setValue(name, value)`: calls `beforeUpdate` and then updates the state of the form.
* `state`: the state of the form `{ afterChange, context, errors, hasErrors, initialContext, initialValues, isDirty, values }`.


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

### `beforeChange({ context, errors, name, value, values }) => undefined`
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

### `dispatch({ context, errors, initialValues, values })`
You can call dispatch to update the state of the form. All fields are optional, so if you want to update just the errors you can omit `context`, `values` and `initialValues`.

You could add `isDirty` and `hasErrors`, but that make no sense because those values are recomputed after aplying the new values.

dispatch will trigger `afterChange`. but it will not trigger `beforeChange`.


### `getValue(name) => string | boolean | any`
It returns the value of the form element whose name is `name`.

You can also use `state.values[name]`.


### `onSubmit={handleSubmit(callback)}

It handles the onSubmit event of the form element.

It calls `callback(values)` if there is no errors.

If the callback function returns something falsy, it understands the forms has been submited so it sets `initialValues` to the current `values` and thus `isDirty` to `false`

If the callback function returns something truthy, it understands the forms has not submited,

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
* `context`:  The object that helps the form to know how to behave, but are not errors or values.
* `initialValues`:  The object that holds the initial values, as you pass in within the `options`. You can change it with `dispatch`, but it will not affect the current values. It could affect `isDirty` though.
* `initialContext`:  The object that holds the initial context.
* `hasErrors`: The ammount of values of the `errors` object. You cannot change it with `dispath`. It is computed by `dispatch`.
* `errors`: It stores whatever errors you set with `beforeChange`. You can change it with `dispatch`, and it will affect `hasErrors`.
* `isDirty`: Boolean that shows whether `values` is deeply equal to `initialValues`.
* `values`: It store the values of your form. It is the parameter of the callback that `handleSubmit` calls. You can change it with `dispatch`.
