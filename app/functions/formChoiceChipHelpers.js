export function _getItemString(item, maxChipItemDisplayLen) {
  var output = null;
  if (item.length > maxChipItemDisplayLen) {
    output = `${item.substr(0, maxChipItemDisplayLen - 1)}...`;
  } else {
    output = item;
  }
  return output;
}

export async function removeChipsFromList(chips, item_list) {
  //chips : dictionary of key:val
  Object.entries(chips).map(([key, value]) => {
    delete item_list[key];
  });
  return item_list;
}

export async function addChipsToList(chips, item_list) {
  //chips : dictionary of key:val
  Object.entries(chips).map(([key, value]) => {
    item_list[key] = value;
  });
  return item_list;
}

export async function onCloseChip(item, selected_list, options_list) {
  //item : dictionary of key:val
  selected_list = await removeChipsFromList(item, selected_list);
  if (options_list) {
    options_list = await addChipsToList(item, options_list);
  }
  return {
    selected_list: selected_list,
    options_list: options_list,
  };
}

export async function onSelectChip(item, selected_list, options_list) {
  //item : dictionary of key:val
  selected_list = await addChipsToList(item, selected_list);
  if (options_list) {
    options_list = await removeChipsFromList(item, options_list);
  }
  return {
    selected_list: selected_list,
    options_list: options_list,
  };
}
