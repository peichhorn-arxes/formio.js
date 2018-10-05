import nestedComponentForm from '../nested/NestedComponent.form';
export default function(...extend) {
  return nestedComponentForm([{
    key: 'display',
    components: [
      {
        type: 'textfield',
        input: true,
        key: 'legend',
        label: 'Legend',
        placeholder: 'Legend',
        weight: 40
      },
      {
        weight: 45,
        type: 'checkbox',
        label: 'Refresh On Change',
        tooltip: 'Rerender the field whenever a value on the form changes.',
        key: 'refreshOnChange',
        input: true
      }
    ]
  }],...extend);
}
