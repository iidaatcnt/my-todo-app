'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Clock } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // 初期データの読み込み
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('保存されたTodoデータの読み込みに失敗しました:', error);
        // エラーの場合はデフォルトデータを設定
        setDefaultTodos();
      }
    } else {
      // 初回起動時はデフォルトのTodoを設定
      setDefaultTodos();
    }
    setIsLoaded(true);
  }, []);

  // デフォルトのTodoを設定する関数
  const setDefaultTodos = () => {
    const defaultTodos = [
      { id: 1, text: 'Claudeでアプリを作成', completed: true },
      { id: 2, text: 'Vercelにデプロイ', completed: false },
      { id: 3, text: 'アプリを公開', completed: false }
    ];
    setTodos(defaultTodos);
  };

  // Todoが変更されるたびにlocalStorageに保存
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const addTodo = (): void => {
    if (inputText.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputText.trim(),
        completed: false
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setInputText('');
    }
  };

  const toggleTodo = (id: number): void => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number): void => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // 全てのTodoをクリアする関数（オプション）
  const clearAllTodos = (): void => {
    if (window.confirm('全てのTodoを削除しますか？')) {
      setTodos([]);
    }
  };

  // データリセット関数（オプション）
  const resetToDefault = (): void => {
    if (window.confirm('デフォルトのTodoにリセットしますか？')) {
      setDefaultTodos();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  // ローディング中の表示
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📝 Todo List
          </h1>
          <p className="text-gray-600">Claudeで作成したサンプルアプリ（永続化対応）</p>
          <div className="mt-4 flex justify-center items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-1" />
              完了: {completedCount}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              残り: {totalCount - completedCount}
            </div>
          </div>
        </div>

        {/* 入力エリア */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="新しいタスクを入力..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addTodo}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>追加</span>
            </button>
          </div>
        </div>

        {/* Todoリスト */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {todos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>まだタスクがありません</p>
              <p className="text-sm">上の入力欄から新しいタスクを追加してください</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150 ${
                    todo.completed ? 'bg-green-50' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {todo.completed && <Check className="w-3 h-3" />}
                  </button>
                  
                  <span
                    className={`flex-1 transition-all duration-200 ${
                      todo.completed
                        ? 'text-gray-500 line-through'
                        : 'text-gray-800'
                    }`}
                  >
                    {todo.text}
                  </span>
                  
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 進捗バー */}
        {totalCount > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">進捗</span>
              <span className="text-sm text-gray-500">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* 管理ボタン */}
        {totalCount > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <div className="flex space-x-4 justify-center">
              <button
                onClick={clearAllTodos}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
              >
                全て削除
              </button>
              <button
                onClick={resetToDefault}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
              >
                デフォルトに戻す
              </button>
            </div>
          </div>
        )}

        {/* フッター */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>🚀 Vercelにデプロイ準備完了！（データ永続化対応）</p>
          <p className="mt-1">💾 Todoはブラウザに自動保存されます</p>
        </div>
      </div>
    </div>
  );
}