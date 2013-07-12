Posts = new Meteor.Collection('posts');

if (Meteor.isServer) {
  seed();

  /*
   * cursorDescription:
   *  selector: {topic_id: null}
   *  options: {sort: {subject: 1}}
   *  ordered: true
   */
  Meteor.publish('all-posts', function () {
    observe(this, function () {
      return Posts.find({topic_id: null}, {sort: {subject: 1}});
    });
  });

  /*
   * cursorDescription:
   *  selector: {topic_id: 5} (new LRS for each topicId)
   *  options: {sort: {subject: 1}}
   *  ordered: true
   */
  Meteor.publish('posts-by-topic', function (topicId) {
    observe(this, function () {
      return Posts.find({topic_id: topicId}, {sort: {subject: 1}});
    });
  });

  /*
   * cursorDescription:
   *  selector: {_id: 1} (new LRS for each postId)
   *  options: {sort: {subject: 1}}
   *  ordered: true
   */
  Meteor.publish('post', function (postId) {
    observe(this, function () {
      return Posts.find({_id: postId});
    });
  });
}
