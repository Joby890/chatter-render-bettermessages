export default function(chatter) {

  this.onEnable = function() {
    this.editImage(this);

    //Test audio
    var testSound = new Audio("http://soundbible.com/grab.php?id=2084&type=mp3");
    chatter.registerSound("ping", testSound);

    chatter.pluginManager.registerEvent(this, "MessageRenderEvent", function(event) {
      if(event.message.showImage) {
        //Test Image
        event.components.push({weight: 1, component: React.createElement("div", {key: "BetterMessagesImage"},
          React.createElement("img", { style: {"float": "left"}, height: 44, src:event.message.showImage}))
        });

      } else {
        event.defaultUserMessage = false;
        event.components.push({weight: 1, component: React.createElement("div", { key: event.message.id, style: {float: "left", height: "1px", width: "50px"}})
        });
      }

    });
    chatter.pluginManager.registerEvent(this, "MessageRecievedEvent", function(event) {
      if(event.message.channel !== chatter.getCurrentChannel()) {
        chatter.playSound("ping");
      }
    });
  };


  this.editImage = function(plugin) {

    var EditImage = React.createClass({

      handleFile: function(e) {
        var reader = new FileReader();
        reader.onload = function(upload) {
          chatter.send("ProfileImage", {image: upload.target.result});
        };

        reader.readAsDataURL(e.target.files[0]);
      },
      render: function() {
        return (
          React.createElement("div", {key: "editImage"}, "Profile Image: ",
            React.createElement("input", {key: "editImage",type: "file", onChange: this.handleFile})
          )
        );
      }

    });
    //React.createElement("div", {key: "editImage"}, React.createElement("span", null, "Profile Image "), EditImage)
    //check to see if there is a usersettings modal display there if not display on right panel
    if(chatter.findModal('channelsettings')) {
      chatter.findModal('channelsettings').addComponent({weight: 1, component: EditImage});
    } else {
      chatter.getPanel('right').addPage(plugin, new Page('editimage', -1,EditImage, null, null, false));
    }
  };

}
