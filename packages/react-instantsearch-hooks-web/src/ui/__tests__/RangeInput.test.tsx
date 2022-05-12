import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { RangeInput } from '../RangeInput';

import type { RangeInputProps } from '../RangeInput';

describe('RangeInput', () => {
  function createProps(props: Partial<RangeInputProps> = {}): RangeInputProps {
    return {
      range: { min: 1, max: 5000 },
      start: [undefined, undefined],
      disabled: false,
      onSubmit: jest.fn(),
      translations: { separator: 'to', submit: 'Go' },
      ...props,
    };
  }

  test('renders with items', () => {
    const props = createProps();
    const { container } = render(<RangeInput {...props} />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-RangeInput"
        >
          <form
            class="ais-RangeInput-form"
          >
            <label
              class="ais-RangeInput-label"
            >
              <input
                class="ais-RangeInput-input ais-RangeInput-input--min"
                max="5000"
                min="1"
                placeholder="1"
                step="1"
                type="number"
                value=""
              />
            </label>
            <span
              class="ais-RangeInput-separator"
            >
              to
            </span>
            <label
              class="ais-RangeInput-label"
            >
              <input
                class="ais-RangeInput-input ais-RangeInput-input--max"
                max="5000"
                min="1"
                placeholder="5000"
                step="1"
                type="number"
                value=""
              />
            </label>
            <button
              class="ais-RangeInput-submit"
              type="submit"
            >
              Go
            </button>
          </form>
        </div>
      </div>
    `);
  });

  test('renders with translations', () => {
    const props = createProps({
      translations: { separator: 'SEPARATOR', submit: 'SUBMIT' },
    });
    const { container } = render(<RangeInput {...props} />);

    expect(
      container.querySelector('.ais-RangeInput-separator')
    ).toHaveTextContent('SEPARATOR');

    expect(container.querySelector('.ais-RangeInput-submit')).toHaveTextContent(
      'SUBMIT'
    );
  });

  describe('input', () => {
    test('render with empty values', () => {
      const props = createProps();
      const { container } = render(<RangeInput {...props} />);

      expect(
        Array.from(
          container.querySelectorAll<HTMLInputElement>('.ais-RangeInput-input')
        ).map((input) => input.value)
      ).toEqual(['', '']);
    });

    test('render with empty values when refinement is equal to range', () => {
      const props = createProps({
        range: { min: 100, max: 1000 },
        start: [100, 1000],
      });
      const { container } = render(<RangeInput {...props} />);

      expect(
        Array.from(
          container.querySelectorAll<HTMLInputElement>('.ais-RangeInput-input')
        ).map((input) => input.value)
      ).toEqual(['', '']);
    });

    test('render with refined values', () => {
      const props = createProps({
        start: [100, 1000],
      });
      const { container } = render(<RangeInput {...props} />);

      expect(
        Array.from(
          container.querySelectorAll<HTMLInputElement>('.ais-RangeInput-input')
        ).map((input) => input.value)
      ).toEqual(['100', '1000']);
    });

    test('steps with specific value', () => {
      const props = createProps({ start: [100, 100], step: 0.01 });
      render(<RangeInput {...props} />);

      ['min', 'max'].forEach((target) => {
        const input = document.querySelector(
          `.ais-RangeInput-input--${target}`
        ) as HTMLInputElement;

        expect(input).toHaveAttribute('step', '0.01');
        expect(input).toHaveValue(100);

        input.stepUp();

        expect(input).toHaveValue(100.01);
      });
    });
  });

  test('calls `onSubmit` callback when submitting form', async () => {
    const props = createProps({ start: [100, 1000] });
    const { container } = render(<RangeInput {...props} />);
    const submitButton = container.querySelector('.ais-RangeInput-submit')!;
    const minInput = container.querySelector('.ais-RangeInput-input--min')!;
    const maxInput = container.querySelector('.ais-RangeInput-input--max')!;

    await userEvent.click(submitButton);

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
    expect(props.onSubmit).toHaveBeenLastCalledWith([100, 1000]);

    await userEvent.type(minInput, '500');
    await userEvent.type(maxInput, '5000');

    await userEvent.click(submitButton);

    expect(props.onSubmit).toHaveBeenCalledTimes(2);
    expect(props.onSubmit).toHaveBeenLastCalledWith([500, 5000]);
  });

  test('allows custom class names', () => {
    const props = createProps({
      disabled: true,
      classNames: {
        root: 'ROOT',
        noRefinementRoot: 'NOREFINEMENTROOT',
        form: 'FORM',
        label: 'LABEL',
        input: 'INPUT',
        inputMin: 'INPUTMIN',
        inputMax: 'INPUTMAX',
        separator: 'SEPARATOR',
        submit: 'SUBMIT',
      },
    });

    const { container } = render(<RangeInput {...props} />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-RangeInput ROOT ais-RangeInput--noRefinement NOREFINEMENTROOT"
        >
          <form
            class="ais-RangeInput-form FORM"
          >
            <label
              class="ais-RangeInput-label LABEL"
            >
              <input
                class="ais-RangeInput-input INPUT ais-RangeInput-input--min INPUTMIN"
                disabled=""
                max="5000"
                min="1"
                placeholder="1"
                step="1"
                type="number"
                value=""
              />
            </label>
            <span
              class="ais-RangeInput-separator SEPARATOR"
            >
              to
            </span>
            <label
              class="ais-RangeInput-label LABEL"
            >
              <input
                class="ais-RangeInput-input INPUT ais-RangeInput-input--max INPUTMAX"
                disabled=""
                max="5000"
                min="1"
                placeholder="5000"
                step="1"
                type="number"
                value=""
              />
            </label>
            <button
              class="ais-RangeInput-submit SUBMIT"
              type="submit"
            >
              Go
            </button>
          </form>
        </div>
      </div>
    `);
  });

  test('forwards `div` props to the root element', () => {
    const props = createProps({
      title: 'Some custom title',
    });
    const { container } = render(<RangeInput {...props} />);

    expect(container.querySelector('.ais-RangeInput')).toHaveAttribute(
      'title',
      'Some custom title'
    );
  });
});
