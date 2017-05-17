app.controller('commentsController', function(){
	this.pic = 20;
	this.comment = {};
	this.comm = function(block){
		console.log(block.comment);
		block.comments.push(block.comment);
		console.log(block.comments);
		block.comment = {};
	};

	this.comments = [
		{
			name: "Eric Cavazos",
			rating: 5,
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident eos dolorem, earum quae quaerat cumque ipsa ipsam voluptatum aperiam, officiis deleniti. Odit amet qui facilis sint architecto debitis modi delectus."	
		},
		{
			name: "James Rhodes",
			rating: 3,
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident eos dolorem, earum quae quaerat cumque ipsa ipsam voluptatum aperiam, officiis deleniti. Odit amet qui facilis sint architecto debitis modi delectus."	
		},
		{
			name: "Chris Banson",
			rating: 1,
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident eos dolorem, earum quae quaerat cumque ipsa ipsam voluptatum aperiam, officiis deleniti. Odit amet qui facilis sint architecto debitis modi delectus."	
		}
	];
});