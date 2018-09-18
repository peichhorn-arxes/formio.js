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
      }
    ]
  }],...extend);
}
