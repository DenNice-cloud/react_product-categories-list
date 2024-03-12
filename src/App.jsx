/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function getUserById(ownId) {
  return usersFromServer.find(user => user.id === ownId);
}

function getCategorieById(categorieId) {
  return categoriesFromServer.find(categorie => categorie.id === categorieId);
}

const products = productsFromServer.map((product) => {
  const categorie = getCategorieById(product.categoryId);
  const user = getUserById(categorie.ownerId);

  const newProductObject = {
    ...product,
    categoryId: categorie,
    ownerId: user,
  };

  return newProductObject;
});

function getPreparedProducts(productsArray, { isActiveTabs }, query) {
  let preparedProducts = [...productsArray];
  const SEARCH_QUARY = query;

  if (isActiveTabs !== 'All') {
    preparedProducts = preparedProducts.filter(
      user => user.ownerId.name === isActiveTabs,
    );
  }

  if (query) {
    preparedProducts = preparedProducts.filter(
      items => items.name.toLowerCase().includes(SEARCH_QUARY.toLowerCase()),
    );
  }

  return preparedProducts;
}

export const App = () => {
  const [isActiveTabs, setIsActiveTabs] = useState('All');
  const [isActiveBoards, setIsActiveBoards] = useState('All');
  const [query, setQuery] = useState('');

  const handleResetInput = () => {
    setQuery('');
  };

  const visibleProducts = getPreparedProducts(
    products,
    { isActiveTabs },
    query,
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={isActiveTabs === 'All' && 'is-active'}
                onClick={() => setIsActiveTabs('All')}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={isActiveTabs === user.name && 'is-active'}
                  onClick={() => setIsActiveTabs(user.name)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  value={query}
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  onChange={(event) => {
                    setQuery(event.currentTarget.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {query !== '' && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => handleResetInput()}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-info"
              >
                All
              </a>
              {/* is-outlined is-info */}
              {categoriesFromServer.map(categorie => (
                <a
                  data-cy="Category"
                  className={cn('button mr-2 my-1', {
                    'is-info': isActiveBoards === categorie.title,
                  })}
                  href="#/"
                  onClick={() => setIsActiveBoards(categorie.title)}
                >
                  {categorie.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length < 1 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.categoryId.icon} - ${product.categoryId.title}`}</td>
                    <td
                      data-cy="ProductUser"
                      className={
                        product.ownerId.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.ownerId.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
