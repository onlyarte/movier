function c_follow(elem, chId) {
  sendReq(
    `/channel/${chId}/follow/`,
    (success) => {
      if (!success) {
        return console.log('failed to follow');
      }

      elem.setAttribute(
        'onClick',
        `c_unfollow(this, '${chId}')`,
      );
      elem.textContent = 'UNFOLLOW';
    },
  );
}

function c_unfollow(elem, chId) {
  sendReq(
    `/channel/${chId}/unfollow/`,
    (success) => {
      if (!success) {
        return console.log('failed to unfollow');
      }

      elem.setAttribute(
        'onClick',
        `c_follow(this, '${chId}')`,
      );
      elem.textContent = 'FOLLOW';
    },
  );
}
