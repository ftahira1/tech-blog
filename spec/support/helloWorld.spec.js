const {format_date} = require('../../utils/helpers');

describe('format_date', () => {
    it('returns a date string', () => {
        const date = new Date('2021/03.25 15:03:20');
        expect(format_date(date)).toBe('3/25/2021');
    })
});

const helloWorld = require('../../utils/helloWorld');
 
describe("helloWorld", () => {
    it("returns hello world", () => {
      expect(helloWorld()).toBe("hello world");
    });
  });


