import _ from 'lodash';

export const calculateEuclideanDistance = (a, b, properties) => {
  const summedSquaredScores = _.reduce(properties, (acc, property) => {
    return acc + Math.pow(a[property] - b[property], 2);
  }, 0);

  return Number(Math.sqrt(summedSquaredScores).toFixed(3));
};
