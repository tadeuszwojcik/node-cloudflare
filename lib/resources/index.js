/*
 * Copyright (C) 2014-present Cloudflare, Inc.

 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

/* eslint-disable global-require */
module.exports = {
  accounts: require('./Accounts.js'),
  accountAccessFirewall: require('./AccountAccessFirewall.js'),
  accountMembers: require('./AccountMembers.js'),
  accountRoles: require('./AccountRoles.js'),
  accountSubscriptions: require('./AccountSubscriptions.js'),
  dnsRecords: require('./DNSRecords.js'),
  dnsAnalytics: require('./DNSAnalytics.js'),
  enterpriseZoneWorkersRoutes: require('./EnterpriseZoneWorkersRoutes.js'),
  ips: require('./IPs.js'),
  user: require('./User.js'),
  userAccessFirewall: require('./UserAccessFirewall.js'),
  userAccountMemberships: require('./UserAccountMemberships.js'),
  userInvites: require('./UserInvites.js'),
  userSubscriptions: require('./UserSubscriptions.js'),
  zones: require('./Zones.js'),
  zoneAccessFirewall: require('./ZoneAccessFirewall.js'),
  zoneAnalytics: require('./ZoneAnalytics.js'),
  zoneSubscription: require('./ZoneSubscription.js'),
  zoneSettings: require('./ZoneSettings.js'),
};
/* eslint-enable global-require */
