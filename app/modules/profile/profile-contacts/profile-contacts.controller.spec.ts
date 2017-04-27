/*
 * Copyright (C) 2014-2017 Taiga Agile LLC <taiga@taiga.io>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * File: profile-contacts.controller.spec.coffee
 */

declare var describe: any;
declare var angular: any;
const module = angular.mock.module;
declare var inject: any;
declare var it: any;
declare var expect: any;
declare var beforeEach: any;
import * as Immutable from "immutable";
declare var sinon: any;

describe("ProfileContacts", function() {
    let $controller = null;
    let provide = null;
    let $rootScope = null;
    const mocks: any = {};

    const _mockUserService = function() {
        mocks.userServices = {
            getContacts: sinon.stub(),
        };

        return provide.value("tgUserService", mocks.userServices);
    };

    const _mockCurrentUserService = function() {
        mocks.currentUserService = {
            getUser: sinon.stub(),
        };

        return provide.value("tgCurrentUserService", mocks.currentUserService);
    };

    const _mocks = () =>
        module(function($provide) {
            provide = $provide;
            _mockUserService();
            _mockCurrentUserService();

            return null;
        })
    ;

    const _inject = (callback= null) =>
        inject(function(_$controller_, _$rootScope_) {
            $rootScope = _$rootScope_;
            return $controller = _$controller_;
        })
    ;

    beforeEach(function() {
        module("taigaProfile");
        _mocks();
        return _inject();
    });

    it("load current user contacts", function(done) {
        const user = Immutable.fromJS({id: 2});

        const contacts = [
            {id: 1},
            {id: 2},
            {id: 3},
        ];

        mocks.currentUserService.getUser.returns(user);

        mocks.userServices.getContacts.withArgs(user.get("id")).promise().resolve(contacts);

        const $scope = $rootScope.$new();

        const ctrl = $controller("ProfileContacts", $scope, {
            user,
        });

        return ctrl.loadContacts().then(function() {
            expect(ctrl.contacts).to.be.equal(contacts);
            expect(ctrl.isCurrentUser).to.be.true;
            return done();
        });
    });

    return it("load user contacts", function(done) {
        const user = Immutable.fromJS({id: 2});
        const user2 = Immutable.fromJS({id: 3});

        const contacts = [
            {id: 1},
            {id: 2},
            {id: 3},
        ];

        mocks.currentUserService.getUser.returns(user2);

        mocks.userServices.getContacts.withArgs(user.get("id")).promise().resolve(contacts);

        const $scope = $rootScope.$new();

        const ctrl = $controller("ProfileContacts", $scope, {
            user,
        });

        return ctrl.loadContacts().then(function() {
            expect(ctrl.contacts).to.be.equal(contacts);
            expect(ctrl.isCurrentUser).to.be.false;
            return done();
        });
    });
});
