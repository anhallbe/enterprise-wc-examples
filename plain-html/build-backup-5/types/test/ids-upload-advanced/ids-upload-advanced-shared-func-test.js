/**
 * @jest-environment jsdom
 */
import IdsUploadAdvancedShared from '../../src/components/ids-upload-advanced/ids-upload-advanced-shared';
describe('IdsUploadAdvanced Component (shared)', () => {
    it('should format bytes from shared file', () => {
        expect(IdsUploadAdvancedShared.formatBytes()).toEqual('');
        expect(IdsUploadAdvancedShared.formatBytes(1048576)).toEqual('1.05 MB');
        expect(IdsUploadAdvancedShared.formatBytes(1048576, 2)).toEqual('1.05 MB');
        expect(IdsUploadAdvancedShared.formatBytes(1048576, 3)).toEqual('1.049 MB');
        expect(IdsUploadAdvancedShared.formatBytes(1048576, 4)).toEqual('1.0486 MB');
        expect(IdsUploadAdvancedShared.formatBytes(1048576, 0)).toEqual('1 MB');
        expect(IdsUploadAdvancedShared.formatBytes(1548576)).toEqual('1.55 MB');
        expect(IdsUploadAdvancedShared.formatBytes(1548576, 2)).toEqual('1.55 MB');
        expect(IdsUploadAdvancedShared.formatBytes(1548576, 3)).toEqual('1.549 MB');
        expect(IdsUploadAdvancedShared.formatBytes(1548576, 4)).toEqual('1.5486 MB');
        expect(IdsUploadAdvancedShared.formatBytes(1548576, 0)).toEqual('2 MB');
    });
});
//# sourceMappingURL=ids-upload-advanced-shared-func-test.js.map