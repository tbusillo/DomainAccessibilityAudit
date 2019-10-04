import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AuditList from './AuditList';
import MockServerAPI from './ServerAPI';

jest.mock('./ServerAPI');

const getByTagAndContent = (container, tag, expr) => {
  return Array.from(container.querySelectorAll(tag))
    .find(el => expr.test(el.textContent));
};
const getTableBySectionTitle = (container, titleExpr) => {
  const h2 = getByTagAndContent(container, 'h2', titleExpr);
  if (h2 == null)
    throw new Error("h2 " + titleExpr + " not found");
  return h2.parentNode.querySelector('table');
};
const init = async (admin) => {
  const mockServer = new MockServerAPI();
  const loginFct = jest.fn();
  const logoutFct = jest.fn();
  const { container, getByText, getAllByTitle } = render(<MemoryRouter><AuditList server={mockServer} login={loginFct} logout={logoutFct} admin={admin}/></MemoryRouter>);
  await wait();
  return { container, getByText, getAllByTitle, loginFct, logoutFct };
};

it("renders with audit information", async () => {
  const { container } = await init(false);
  const auditTable = getTableBySectionTitle(container, /^Saved Audits$/i);
  expect(auditTable.querySelector('tr td').textContent).toBe('initialDomainName1');
  expect(auditTable.querySelector('tr td:nth-of-type(2)').textContent).toBe('8/27/2019');
});

it("calls the login function with the password", async () => {
  const { container, getByText, loginFct } = await init(false);
  const passwordInput = container.querySelector('#password');
  fireEvent.change(passwordInput, { target: { value: 'test' } });
  fireEvent.click(getByText("Log in"));
  expect(loginFct).toBeCalledWith('test');
});

it("calls the logout function", async () => {
  const { getByText, logoutFct } = await init(true);
  fireEvent.click(getByText("Log out"));
  expect(logoutFct).toBeCalled();
});

it("removes an audit", async () => {
  const { container, getAllByTitle } = await init(true);
  const auditTable = getTableBySectionTitle(container, /^Saved Audits$/i);
  const nb1 = auditTable.querySelectorAll('tr').length;
  fireEvent.click(getAllByTitle("Remove")[0]);
  await wait();
  const nb2 = auditTable.querySelectorAll('tr').length;
  expect(nb2).toBe(nb1 - 1);
  expect(auditTable.querySelector('tr td').textContent).toBe('initialDomainName2');
});