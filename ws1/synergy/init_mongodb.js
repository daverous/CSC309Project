var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var connection = mongoose.connect('mongodb://localhost/csc309_project');

var HouseProfile = require('./models/house').model;
var UserProfile = require('./models/user').model;

var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

var i;
var j;
var split;
var first_name;
var last_name;
var username;
var email;
var password;
var rating;
var friends = [];
var test_users = ["Dark Star", "Luffy Senpai", "Icongito Dual", "Robert Douche",
"Shawn Con", "Tom Potter", "Jerry Lit", "Bruce Wayne", "Archer Conners",
"Icon Shadow", "Hawkeye Cake"];
var numusers = test_users.length;

function addUsers () {
  for (i = 0; i < numusers; i++) {
    split = test_users[i].split(" ");
    first_name = split[0];
    last_name = split[1];
    username = first_name + "." + last_name;
    email = username + "@superhero.com";
    password = first_name + last_name + "1234";
    rating = i % 5;

    var createUser = new UserProfile();
    createUser.username = username;
    createUser.email = email;
    createUser.firstName = first_name;
    createUser.lastName = last_name;
    createUser.password = createHash(password);
    createUser.rating = rating;
    createUser._friends = friends;
    friends[i] = createUser;
    console.log("Adding user - " + username);
    createUser.save(function (err) {
      //handle error
    });
  }
}

var desc = [
  "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.",
  "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus",
  "Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
];

var fakeHouses = [
  ['9568 Shady Treasure Route', 'Jackpot', 'District of Columbia', '20067-9425', 'US', '202-711-9731'],
  ['985 Cinder Pointe', 'Tanwax', 'Alaska', '99615-1483', 'US', '907-573-6645'],
  ['933 Old Forest Acres', 'Beaver Flat', 'Wyoming', '82068-8048', 'US', '307-319-5967'],
  ['9892 Cotton Lake Falls', 'Shields', 'Missouri', '65242-0654', 'US', '636-888-5620'],
  ['6290 Cozy Berry Key', 'Zipperlandville', 'Colorado', '80485-6339', 'US', '720-755-4623'],
  ['7358 Pleasant Pathway', 'Beaumont', 'Kentucky', '40409-1207', 'US', '502-233-5056'],
  ['6009 Noble Manor', 'Gooseneck', 'Wyoming', '82867-9372', 'US', '307-346-4394'],
  ['4287 Colonial Gate Private', 'Needy', 'Alaska', '99904-2231', 'US', '907-277-4265'],
  ['3859 Red Glade', 'Mousetail', 'Missouri', '65550-5787', 'US', '417-748-7384'],
  ['8652 Grand Branch Quay', 'Ste. Anne', 'Ontario', 'N0B-0S8', 'CA', '289-736-9380'],
  ['2246 Wishing Goose Heath', 'Nut Plains', 'Wyoming', '82492-7566', 'US', '307-000-3675'],
  ['1850 Fallen Valley', 'Nipinnawasee', 'Massachusetts', '01185-3191', 'US', '413-239-6537'],
  ['3790 Round Bear Isle', 'Spotsylvania', 'New York', '12742-1051', 'US', '631-651-0979'],
  ['5883 Silver Diversion', 'Beauty', 'New York', '13534-8148', 'US', '607-020-9111'],
  ['3015 Honey Hills Cove', 'Winklepleck Grove', 'Missouri', '65067-9069', 'US', '816-864-7232'],
  ['3056 Crystal Park', 'Hassunadchuauck', 'Florida', '34092-7274', 'US', '352-793-8871'],
  ['8480 Quaking Sky Ledge', 'Pencil Bluff', 'Missouri', '64063-6259', 'US', '573-777-6444'],
  ['7084 Velvet Rabbit Woods', 'Smugglers Notch', 'Idaho', '83585-2725', 'US', '208-610-4400'],
  ['9708 Rocky Loop', 'Fourteen Bend', 'Iowa', '50193-4278', 'US', '319-832-1753'],
  ['9446 Hidden Farm', 'Tobacco Landing', 'Arizona', '86020-0141', 'US', '480-310-0405']
];

var housename;
var descr;
var owner;
var addr;
var price;
var maxrenters;
var currenters;
var currentrenters;
var numdesc = desc.length;

function addHouses () {
  for (j = 0; j < fakeHouses.length; j++) {
    descr = desc[j % numdesc];
    owner = test_users[j % numusers];

    var split = fakeHouses[j][0].split(" ");
    housename = split[1] + " " + split[2];

    addr = "";
    for (i = 0; i < 4; i++) {
      addr += fakeHouses[j][i] + ", ";
    }
    addr += fakeHouses[j][4];
    
    phone = fakeHouses[j][5];
    maxrenters = (j % 3) + 3;

    if (j % 3) {
      currenters = 1;
    } else {
      currenters = 2;
    }

    price = (maxrenters - currenters)*500;

    currentrenters = [];
    for (i = 0; i < currenters; i++) {
      currentrenters[i] = friends[j % numusers];
    }

    rating = j % 5;

    var createHouse = new HouseProfile();
    createHouse.name = housename;
    createHouse.desc = descr;
    createHouse.addr = addr;
    createHouse.price = price;
    createHouse.maxRenters = maxrenters;
    createHouse.phone = phone;
    createHouse.owner = owner;
    createHouse.rating = rating;
    createHouse.currentRenters = currentrenters;
    console.log("Adding house - " + housename);
    createHouse.save(function (err) {
      if (err) {
        throw err;
      }
    });
  }
}


UserProfile.remove({}, function(err) {
  console.log("Removing users");
  HouseProfile.remove({}, function(err) {
    console.log("Removing houses");
    addUsers();
    addHouses();
  });
});
