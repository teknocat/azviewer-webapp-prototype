class renderHelper {
  static renderRowItems(renderRowItem) {
    return [
      renderRowItem("a", "あ行"),
      renderRowItem("ka", "か行"),
      renderRowItem("sa", "さ行"),
      renderRowItem("ta", "た行"),
      renderRowItem("na", "な行"),
      renderRowItem("ha", "は行"),
      renderRowItem("ma", "ま行"),
      renderRowItem("ya", "や行"),
      renderRowItem("ra", "ら行"),
      renderRowItem("wa", "わ行"),
    ]
  }
  
  static renderColumnItems(renderColumnItem, key) {
    switch (key) {
      case "a":
        return [
          renderColumnItem("a", "あ"),
          renderColumnItem("i", "い"),
          renderColumnItem("u", "う"),
          renderColumnItem("e", "え"),
          renderColumnItem("o", "お"),
        ];
      case "ka":
        return [
          renderColumnItem("ka", "か"),
          renderColumnItem("ki", "き"),
          renderColumnItem("ku", "く"),
          renderColumnItem("ke", "け"),
          renderColumnItem("ko", "こ"),
        ];
      case "sa":
        return [
          renderColumnItem("sa", "さ"),
          renderColumnItem("si", "し"),
          renderColumnItem("su", "す"),
          renderColumnItem("se", "せ"),
          renderColumnItem("so", "そ"),
        ];
      case "ta":
        return [
          renderColumnItem("ta", "た"),
          renderColumnItem("ti", "ち"),
          renderColumnItem("tu", "つ"),
          renderColumnItem("te", "て"),
          renderColumnItem("to", "と"),
        ];
      case "na":
        return [
          renderColumnItem("na", "な"),
          renderColumnItem("ni", "に"),
          renderColumnItem("nu", "ぬ"),
          renderColumnItem("ne", "ね"),
          renderColumnItem("no", "の"),
        ];
      case "ha":
        return [
          renderColumnItem("ha", "は"),
          renderColumnItem("hi", "ひ"),
          renderColumnItem("hu", "ふ"),
          renderColumnItem("he", "へ"),
          renderColumnItem("ho", "ほ"),
        ];
      case "ma":
        return [
          renderColumnItem("ma", "ま"),
          renderColumnItem("mi", "み"),
          renderColumnItem("mu", "む"),
          renderColumnItem("me", "め"),
          renderColumnItem("mo", "も"),
        ];
      case "ya":
        return [
          renderColumnItem("ya", "や"),
          renderColumnItem("yu", "ゆ"),
          renderColumnItem("yo", "よ"),
        ];
      case "ra":
        return [
          renderColumnItem("ra", "ら"),
          renderColumnItem("ri", "り"),
          renderColumnItem("ru", "る"),
          renderColumnItem("re", "れ"),
          renderColumnItem("ro", "ろ"),
        ];
      case "wa":
        return [
          renderColumnItem("wa", "わ"),
          renderColumnItem("wo", "を"),
          renderColumnItem("n", "ん"),
        ];
    }
  }
}

export default renderHelper;