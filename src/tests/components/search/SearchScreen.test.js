import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { mount } from 'enzyme';

import SearchScreen from '../../../components/Search/SearchScreen';

describe('Pruebas en <SearchScreen />', () => {
  test('debe de mostrarse correctamente con valores por defecto', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/search']}>
        <Route path='/search' component={SearchScreen} />
      </MemoryRouter>,
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.alert-info').text().trim()).toBe('Search a hero');
  });

  test('debe de mostrar a batman y el input con el valor del queryString', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/search?q=batman']}>
        <Route path='/search' component={SearchScreen} />
      </MemoryRouter>,
    );

    expect(wrapper.find('input').prop('value')).toBe('batman');
    expect(wrapper).toMatchSnapshot();
  });

  test('debe de mostrar un error si no se encuentra el hero', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/search?q=heroNotExist']}>
        <Route path='/search' component={SearchScreen} />
      </MemoryRouter>,
    );

    expect(wrapper.find('.alert-danger').text().trim()).toBe(
      'There is no a hero with heroNotExist',
    );
  });

  test('debe de llamar el history', () => {
    const historyMock = {
      push: jest.fn(),
    };

    const wrapper = mount(
      <MemoryRouter initialEntries={['/search?q=batman']}>
        <Route
          path='/search'
          component={() => <SearchScreen history={historyMock} />}
        />
      </MemoryRouter>,
    );

    wrapper.find('input').simulate('change', {
      target: {
        name: 'searchText',
        value: 'batman',
      },
    });

    const submit = wrapper.find('form').prop('onSubmit');
    submit({ preventDefault() {} });

    expect(historyMock.push).toHaveBeenCalledWith('?q=batman');
  });
});