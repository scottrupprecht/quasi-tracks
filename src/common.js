import _ from 'lodash';

export const sOrNoS = (countOrArray) => {
  const numItems = _.isObjectLike(countOrArray) ? _.size(countOrArray) : countOrArray;
  return numItems !== 1 ? 's' : '';
};
