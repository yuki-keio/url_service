let target = "";

function stchange(encode = true) {
  const inputValue = $("#inputarea").val().trim();

  if (!inputValue) {
    $("#outputarea").val("");
    return;
  }

  try {
    target = encodeURI(inputValue);
    if (encode) {
      $("#outputarea").val(target);
    }

    // フィードバック表示
    showFeedback("success", "URLが正常に変換されました");

    if ($("#copy").prop("checked")) {
      copyToClipboard(target);
    }
  } catch (error) {
    showFeedback("error", "URL変換中にエラーが発生しました");
    console.error("Encoding error:", error);
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(function () {
    showFeedback("success", "クリップボードにコピーしました");
  }).catch(function (e) {
    console.log("Modern clipboard API failed, using fallback");

    // フォールバック方式
    var listener = function (e) {
      e.clipboardData.setData("text/plain", text);
      e.preventDefault();
      document.removeEventListener("copy", listener);
    }

    document.addEventListener("copy", listener);
    document.execCommand("copy");
    showFeedback("success", "クリップボードにコピーしました");
  });
}

function showFeedback(type, message) {
  // 既存のフィードバックを削除
  $(".feedback").remove();

  const feedbackClass = type === "success" ? "feedback-success" : "feedback-error";
  const emoji = type === "success" ? "✅" : "❌";

  const feedback = $(`
    <div class="feedback ${feedbackClass}">
      ${emoji} ${message}
    </div>
  `);

  $(".container").prepend(feedback);

  // 3秒後に自動で削除
  setTimeout(() => {
    feedback.fadeOut(300, function () {
      $(this).remove();
    });
  }, 3000);
}

$(function () {
  // レスポンシブタイトル調整
  function adjustTitle() {
    if (window.matchMedia('(max-width: 767px)').matches) {
      $("h1").html("日本語URL変換");
    } else {
      $("h1").html("日本語URL・変換サイト");
    }
  }

  adjustTitle();
  $(window).resize(adjustTitle);

  // 入力イベント
  $("#inputarea").on("input keyup", function () {
    stchange();
  });

  // ペーストイベント
  $("#inputarea").on("paste", function () {
    setTimeout(function () {
      stchange();
    }, 50);
  });

  // チェックボックス変更イベント
  $("#copy").change(function () {
    if ($(this).prop("checked") && target) {
      copyToClipboard(target);
    }
  });

  // 初期フォーカス
  $("#inputarea").focus();
});

// CSS for feedback messages (追加スタイル)
const feedbackCSS = `
<style>
.feedback {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideInRight 0.3s ease;
}

.feedback-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.feedback-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .feedback {
    top: 10px;
    right: 10px;
    left: 10px;
    font-size: 0.9rem;
  }
}
</style>`;

// フィードバック用CSSを動的に追加
$(document).ready(function () {
  $("head").append(feedbackCSS);
});
