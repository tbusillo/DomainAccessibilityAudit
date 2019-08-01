import React, { Component } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap'
import PropTypes from 'prop-types';

import ServerAPI from './ServerAPI';
import ViolationStats from './ViolationStats';

class Audit extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      audit: null,
    };
    this.props.server.getAudit(this.props.match.params.auditId)
      .then((audit) => {
        this.setState({ audit });
      })
      .catch((err) => console.log(err));
  }
  
  render() {
    return (
      <section className="pageContent">
        <Breadcrumb>
          <LinkContainer to="/audits/">
            <Breadcrumb.Item>Audits</Breadcrumb.Item>
          </LinkContainer>
          <Breadcrumb.Item active>Audit</Breadcrumb.Item>
        </Breadcrumb>
        <h2>{this.state.audit ?
          <span className="code">{this.state.audit.initialDomainName}</span>
          : ''}</h2>
        {this.state.audit &&
          <>
            <Table bordered size="sm" className="data">
              <caption>AUDIT PARAMETERS</caption>
              <tbody>
                <tr>
                  <th>First URL</th>
                  <td className="code">{this.state.audit.firstURL}</td>
                </tr>
                <tr>
                  <th>Check subdomains</th>
                  <td className="code">{this.state.audit.checkSubdomains ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <th>Maximum depth</th>
                  <td>{this.state.audit.maxDepth}</td>
                </tr>
                <tr>
                  <th>Maximum number of pages checked per domain</th>
                  <td>{this.state.audit.maxPagesPerDomain}</td>
                </tr>
                <tr>
                  <th>Use site maps</th>
                  <td className="code">{this.state.audit.sitemaps ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <th>Include only paths matching the regular expression</th>
                  <td className="code">{this.state.audit.includeMatch}</td>
                </tr>
                <tr>
                  <th>Web browser</th>
                  <td>{this.state.audit.browser}</td>
                </tr>
                <tr>
                  <th>Date started</th>
                  <td>{(new Date(this.state.audit.dateStarted)).toLocaleString()}</td>
                </tr>
                <tr>
                  <th>Date ended</th>
                  <td>{this.state.audit.dateEnded &&
                    (new Date(this.state.audit.dateEnded)).toLocaleString()}</td>
                </tr>
                <tr>
                  <th>Audit completed</th>
                  <td>{this.state.audit.complete ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <th>Number of checked URLs</th>
                  <td>{this.state.audit.nbCheckedURLs}</td>
                </tr>
                <tr>
                  <th>Number of accessibility violations</th>
                  <td>{this.state.audit.nbViolations}</td>
                </tr>
                <tr>
                  <th>Number of scan errors</th>
                  <td>{this.state.audit.nbScanErrors}</td>
                </tr>
              </tbody>
            </Table>
            <ViolationStats stats={this.state.audit.violationStats}
              items={this.state.audit.domains} itemType="domain"/>
            <Table bordered size="sm" className="data">
              <caption>DOMAINS</caption>
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="text-right">Checked URLs</th>
                  <th className="text-right">Violations</th>
                </tr>
              </thead>
              <tbody>
                {this.state.audit.domains
                  .sort((d1,d2) => d1.name.localeCompare(d2.name))
                  .map(domain => (
                  <tr key={domain._id}>
                    <td className="code">
                      <Link to={'/domains/'+domain._id}
                        className="nav-link">{domain.name}</Link>
                    </td>
                    <td className="text-right">{domain.nbCheckedURLs}</td>
                    <td className="text-right">{domain.nbViolations}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        }
      </section>
    );
  }
  
}

Audit.propTypes = {
  server: PropTypes.instanceOf(ServerAPI).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      auditId: PropTypes.string.isRequired,
    })
  }),
};

export default Audit;
