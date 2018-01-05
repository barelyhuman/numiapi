const path = require('path');
const fs = require('fs');

const files = fs.readdirSync('files');
const members = require('./main.json');
let json = [];



function main(cb){
	const membersMap ={};

	members.forEach(function(member){
		let l = member.avatar.split('/');
		let len = l.length;
		membersMap[l[len-1]]=member;
	})

	membersMapKeys = Object.keys(membersMap);

	files.forEach(function(file){
		if(file!=='profile.svg' && membersMapKeys.indexOf(file)===-1){
			addToJson(file);
		}
	})

	return cb([...members,...json]);
}

function addToJson(file){
	let temp = JSON.parse(JSON.stringify(json));
	temp.push({
		name:getName(file),
		position:"",
		avatar:"team/files/"+file,
		description:"",
		currentMember:true	
	});
	json = temp;
}

function getName(str){
	let name = str.replace(/\.\w+/,'').replace('-',' ').split(' ');
	let fullName = name.map(function(word){
		return word.charAt(0).toUpperCase()+word.slice(1);	
	})
	return fullName.join(' ');
}

main(function(data){
	fs.writeFile('main.json',JSON.stringify(data,null,4),function(err){
		err?console.log(err):null;
		console.log("Done writing to file");
	});
})