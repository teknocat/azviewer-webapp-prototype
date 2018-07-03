import Work from './index';
import { shallow } from 'enzyme';

describe('WorkView', () => {

  const props = {
    works: [
        { title: 'x', _person: { familyName: 'a', givenName: 'b' }},
        { title: 'y', _person: { familyName: 'c', givenName: 'd' }}
      ],
  };

  it('shows two elements', () => {
    const element = shallow(<Work { ...props } />);

    expect(element.find('.work')).to.have.length(2);
  });

});