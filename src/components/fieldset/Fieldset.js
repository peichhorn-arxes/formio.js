import NestedComponent from '../nested/NestedComponent';

export default class FieldsetComponent extends NestedComponent {
  static schema(...extend) {
    return NestedComponent.schema({
      label: 'Field Set',
      key: 'fieldSet',
      type: 'fieldset',
      legend: '',
      components: [],
      input: false,
      persistent: false
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Field Set',
      icon: 'fa fa-th-large',
      group: 'layout',
      documentation: 'http://help.form.io/userguide/#fieldset',
      weight: 20,
      schema: FieldsetComponent.schema()
    };
  }

  get defaultSchema() {
    return FieldsetComponent.schema();
  }

  getContainer() {
    return this.body;
  }

  get className() {
    return `form-group ${super.className}`;
  }

  setLegend() {
    this.legendText.innerHTML = this.interpolate(this.component.legend, {
      data: this.data
    });
  }

  build(state) {
    this.element = this.ce('fieldset', {
      id: this.id,
      class: this.className
    });
    if (this.component.legend) {
      this.legendText = this.ce('span');
      const legend = this.ce('legend');
      legend.appendChild(this.legendText);

      this.setLegend();

      if (this.component.refreshOnChange) {
        this.on('change', () => this.setLegend());
      }

      this.createTooltip(legend);
      this.setCollapseHeader(legend);
      this.element.appendChild(legend);
    }
    this.body = this.ce('div', {
      class: 'card-body'
    });
    this.addComponents(null, null, null, state);
    this.element.appendChild(this.body);
    this.setCollapsed();
    this.attachLogic();
  }
}
