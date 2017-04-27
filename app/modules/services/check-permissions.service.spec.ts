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
 * File: check-permissions.service.spec.coffee
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

describe("tgCheckPermissionsService", function() {
    let provide;
    let checkPermissionsService = (provide = null);
    const mocks: any = {};

    const _mockProjectService = function() {
        mocks.projectService = {
            project: sinon.stub(),
        };

        return provide.value("tgProjectService", mocks.projectService);
    };

    const _inject = () =>
        inject((_tgCheckPermissionsService_) => checkPermissionsService = _tgCheckPermissionsService_)
    ;

    const _mocks = () =>
        module(function($provide) {
            provide = $provide;
            _mockProjectService();

            return null;
        })
    ;

    beforeEach(function() {
        module("taigaCommon");
        _mocks();
        return _inject();
    });

    it("the user has perms", function() {
        mocks.projectService.project = Immutable.fromJS({
            my_permissions: ["add_us"],
        });

        const perm = checkPermissionsService.check("add_us");

        return expect(perm).to.be.true;
    });

    return it("the user hasn't perms", function() {
        mocks.projectService.project = Immutable.fromJS({
            my_permissions: [],
        });

        const perm = checkPermissionsService.check("add_us");

        return expect(perm).to.be.false;
    });
});
