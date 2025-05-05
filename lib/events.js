let commands = [];
function command(info, func) {
    var infos = info;
    infos.function = func;
    infos.pattern = new RegExp(`${global.config.HANDLERS}( ?${info.pattern})`, `is`);
    if (!infos.dontAddCommandList) infos.dontAddCommandList = false;
    if (!infos.fromMe) infos.dontAddCommandList = false;
    if (!info.type) infos.type = "misc";
    commands.push(infos);
    return infos;
}
module.exports = {
    command,
    commands,
};
